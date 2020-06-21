const fs = require('fs')
const path = require('path')
const parse = require('csv-parse')


/**
 * File service provides some methods to manipulate files
 */
function FileService() {
    this.fileBase = 'temp/files'
}

/**
 * Read file passing a path
 * @param {String} path 
 * @param {"utf-8" | "binary"} encoding
 * @returns {Buffer | null} 
 */
FileService.prototype.getFile = function (path, encoding = 'binary') {
    return new Promise(async (resolve, reject) => {
        if (path && path != '') {
            try {
                let file = await fs.readFileSync(this.joinPath(path), {
                    encoding
                })
                resolve(file)
            } catch (error) {
                if (error.code == 'ENOENT') reject({ code: 404, message: 'File not found' })
                else reject(error)
            }
        } else {
            reject({ code: 400 })
        }
    })
}

/**
 * Add a new line an existing file or create a new file if not
 * @param {string} path File path to persist data
 * @param {string} line the new line to be added to the file
 */
FileService.prototype.addLine = async function (path, line) {
    try {
        let content
        try {
            content = await this.getFile(path, "utf-8")
            content += `\n${line}`
        } catch (error) {
            content = line
        }
        this.updateFileContent(path, content)
    } catch (error) {
        console.error(error)
        throw error
    }
}

/**
 * Update or create a new file with content
 * @param {string} path File path
 * @param {string} content File content to be updated
 */
FileService.prototype.updateFileContent = async function (path, content) {
    try {
        let file = await fs.writeFileSync(this.joinPath(path), content)
        return file
    } catch (error) {
        console.error(error)
        throw error
    }
}

/**
 * Join desired path to files location 
 * @param {string} filePath  File Path
 */
FileService.prototype.joinPath = function (filePath) {
    return path.join(process.cwd(), this.fileBase, filePath)
}

FileService.prototype.getCsvFile = function (filePath) {
    return new Promise((resolve, reject) => {
        try {
            let output = []
            this.getFile(filePath).then(file => {
                const parser = parse(file, {
                    delimiter: ','
                })
                parser.on('readable', function () {
                    let record
                    while (record = parser.read()) {
                        output.push(record)
                    }
                })
                parser.on('error', function (err) {
                    reject(err)
                })
                parser.on('end', () => {
                    resolve(output)
                })
            })
                .catch(reject)
        } catch (error) {
            reject(error)
        }
    })

}

FileService.prototype.getFileExtension = function (filePath) {
    if (typeof filePath === "string") {
        const splittedArray = filePath.split('.')
        const extension = splittedArray[splittedArray.length - 1]
        return extension
    } else {
        throw new Error("Invalid path type, must be a string")
    }
}


module.exports = FileService