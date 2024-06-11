async function compareOutputs(generatedOutput, expectedOutput) {
    // Trim the outputs
    const trimmedGeneratedOutput = generatedOutput.trim();
    const trimmedExpectedOutput = expectedOutput.trim();

    return trimmedGeneratedOutput === trimmedExpectedOutput;
}

module.exports = { compareOutputs };

