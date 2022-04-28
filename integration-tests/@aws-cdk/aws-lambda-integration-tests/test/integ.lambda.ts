import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-lambda-1');

const fn = new lambda.Function(stack, 'MyLambda', {
  code: new lambda.InlineCode('foo'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_14_X,
});

fn.addToRolePolicy(new iam.PolicyStatement({
  resources: ['*'],
  actions: ['*'],
}));
fn.addFunctionUrl();

const version = fn.currentVersion;

const alias = new lambda.Alias(stack, 'Alias', {
  aliasName: 'prod',
  version,
});
alias.addPermission('AliasPermission', {
  principal: new iam.ServicePrincipal('cloudformation.amazonaws.com'),
});
alias.addFunctionUrl({
  authType: lambda.FunctionUrlAuthType.NONE,
});

app.synth();