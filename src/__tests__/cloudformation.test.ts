import * as yamlCfn from 'yaml-cfn';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

let template: any;
beforeAll(async () => {
    const input = fs.readFileSync(path.join(__dirname, "../../lambda.template.yaml"), 'utf8');
    template = yaml.safeLoad(input, { schema: yamlCfn.schema });
})

test('Lambda関数の定義に関数名と説明文が記載されているか', () => {
    for (const key in template) {
        if (key === 'Resources') {
            const resources = template[key]
            for (const key in resources) {
                if (resources[key]['Type'] == 'AWS::Serverless::Function') {
                    expect(resources[key]['Properties']).toHaveProperty('FunctionName');
                    expect(resources[key]['Properties']).toHaveProperty('Description');
                }
            }
        }
    }
});


test('Lambda関数１つに対してCloudWatchのロググループが定義されているか', () => {
    // スタックを繰りかえし作成・削除することを想定しています
    // Lambda関数は作成されてから、実行されると自動的に /aws/lambda/関数名 という名称のロググループを作成しログを出力します
    // この場合、スタックを削除してもLambdaが自動的に作成したロググループは削除されずに残ることになるため、
    // Lambda関数を作成時にロググループも合わせて作成しておくことで、スタック削除時に合わせてロググループも削除することができます。
    const lambdaList = getLambdaFunctionLogicalIds();
    for (let i: number; i < lambdaList.length; i++) {
        // lambdaList[i];
        const logGroupNameList = getLogGroupNames();
        expect(JSON.stringify(logGroupNameList[i]))
            .toBe(JSON.stringify({ 'Fn::Sub': '/aws/lambda/${' + lambdaList[i] + '}' }));
    }
});

/**
 * 定義済みのLambdaFunctionの物理IDを取得する
 */
const getLambdaFunctionLogicalIds = (): string[] => {
    let result: string[] = [];
    for (const key in template) {
        if (key === 'Resources') {
            const resources = template[key]
            for (const key in resources) {
                if (resources[key]['Type'] === 'AWS::Serverless::Function') {
                    result.push(key)
                }
            }
        }
    }
    return result;
}

/**
 * 定義済みのLogGroupNameの一覧を取得する
 */
const getLogGroupNames = () => {
    let result: string[] = [];
    for (const key in template) {
        if (key === 'Resources') {
            const resources = template[key]
            for (const key in resources) {
                if (resources[key]['Type'] === 'AWS::Logs::LogGroup') {
                    result.push(resources[key]['Properties']['LogGroupName'])
                }
            }
        }
    }
    return result;
}