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
FileService.prototype.addLine = function (path, line) {
    return new Promise((resolve, reject) => {
        try {
            this.getFile(path, "utf-8")
                .then((content) => {
                    content += `\n${line}`
                    this.updateFileContent(path, content)
                        .then(resolve)
                        .catch(reject)
                }).catch((error) => {
                    if (error.code == 404) {
                        this.updateFileContent(path, line)
                            .then(resolve)
                            .catch(reject)
                    } else reject(error)
                })
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * Update or create a new file with content
 * @param {string} path File path
 * @param {string} content File content to be updated
 */
FileService.prototype.updateFileContent = function (path, content) {
    return new Promise((resolve, reject) => {
        try {
            fs.writeFile(this.joinPath(path), content, (error) => {
                if (error) reject(error)
                else resolve()
            })
        } catch (error) {
            reject(error)
        }
    })
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