import * as ts from 'typescript';

const sapDefine = ts.createIdentifier("sap.ui.define");

function getDefineKeywordStatementIndex(node: ts.SourceFile): number {
    return node.statements.findIndex((state): boolean => {
        return false; 
    }); 
}


export default (ctx: ts.TransformationContext, program: ts.Program): ts.Transformer<ts.SourceFile> => {
    return sourceFile => {
        changeDefineToSapUiDefine(sourceFile);
        return sourceFile;
    };
}

function changeDefineToSapUiDefine(sourceFile: ts.SourceFile) {
    let [defineStatement] = sourceFile.statements;
    if (ts.isExpressionStatement(defineStatement)) {
        const callExpression = defineStatement.expression;
        if (ts.isCallExpression(callExpression)) {
            const defineIdentifier = callExpression.expression;
            if (ts.isIdentifier(defineIdentifier)) {
                if (defineIdentifier.escapedText === "define") {
                    callExpression.expression = sapDefine;
                    const [ dependencyArray, codeFn ] = callExpression.arguments;
                    if (ts.isArrayLiteralExpression(dependencyArray)) {
                        let [ , , ...depend ]  = dependencyArray.elements;
                        dependencyArray.elements = ts.createNodeArray(depend);
                    }
                    if (ts.isFunctionExpression(codeFn)) {
                        let [ , , ...depend ] = codeFn.parameters
                        codeFn.parameters = ts.createNodeArray(depend);
                        let [ useStrict, ...statements ] = codeFn.body.statements;
                        const importedDefaultFix: ts.Statement[] = depend.map((dep): ts.Statement => {
                            const aliasName = dep.name;
                            if (ts.isIdentifier(aliasName)) {
                                return ts.createIf(
                                    ts.createLogicalAnd( // aliasName && !aliasName.default
                                        aliasName,
                                        ts.createLogicalNot(ts.createPropertyAccess(aliasName, "default"))
                                    ),
                                    ts.createStatement(
                                        ts.createAssignment(
                                            ts.createPropertyAccess(aliasName, "default"),
                                            aliasName
                                        )
                                    )
                                );
                            }
                        });
                        codeFn.body = ts.updateBlock(codeFn.body, [
                            useStrict,
                            ts.createVariableStatement(
                                undefined,
                                ts.createVariableDeclarationList([
                                    ts.createVariableDeclaration(ts.createIdentifier("exports"), undefined, ts.createObjectLiteral())
                                ])
                            ),
                            ...importedDefaultFix,
                            ...statements,
                            ts.createReturn(
                                ts.createLogicalOr(
                                    ts.createPropertyAccess(
                                        ts.createIdentifier("exports"), 
                                        "default"
                                    ), 
                                    ts.createIdentifier("exports")
                                )
                            )
                        ])
                    }
                }
            }
        }
    }
}
