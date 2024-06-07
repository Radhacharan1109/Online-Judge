const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const dirInputs = path.join(__dirname, 'inputs');

if (!fs.existsSync(dirInputs)) {
    fs.mkdirSync(dirInputs, { recursive: true });
}

const generateInputFile = async (input) => {
    const jobID = uuid();
    const input_filename = `${jobID}.txt`;
    const input_filePath = path.join(dirInputs, input_filename);

    // Modify input to insert newlines after each space-separated value because of python
    const formattedInput = input.replace(/\s+/g, '\n');

    await fs.writeFileSync(input_filePath, formattedInput);
    return input_filePath;
};

module.exports = {
    generateInputFile,
};
