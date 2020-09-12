const fs = require("fs");
const shell = require("shelljs");
const tmp = require("tmp");

const { toMatchPdfSnapshot } = require("jest-pdf-snapshot");
expect.extend({ toMatchPdfSnapshot });

shell.cd("__test__");

function compileSATySFi(src) {
    const tmpFile = tmp.fileSync();
    const { code: exitCode } = shell.exec(`satysfi ${src} -o ${tmpFile.name} -b --debug-show-bbox --debug-show-block-bbox`);
    const pdfBuffer = fs.readFileSync(tmpFile.name);
    tmpFile.removeCallback();
    return {
        exitCode,
        pdfBuffer
    };
}

afterAll(() => {
    shell.rm("*.satysfi-aux");
});

test("SATySFi is installed", () => {
    expect(shell.exec("satysfi --version").code).toBe(0);
});

test("Snapshot test", () => {
    const result = compileSATySFi("test.saty");
    expect(result.exitCode).toBe(0);
    expect(result.pdfBuffer).toMatchPdfSnapshot();
});
