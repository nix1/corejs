/*
 * Copyright (c) 2014 Samsung Electronics Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*global define*/

/**
 * Filesystem helper
 * @requires {@link core/tizen}
 * @namespace core/filesystem
 * @memberof core
 */

define(
    'core/filesystem',
    [
        'core/tizen'
    ],
    function coreFilesystem(tizen) {
        'use strict';


        /**
         * @type {string}
         */
        var URI_PREFIX = 'file://';

        /**
         * No operation.
         * @return {undefined}
         */
        function noop() { return; }

        /**
         * Returns file name for given path.
         * @memberof core/filesystem
         * @param {string} path Path.
         * @return {string} Basename.
         */
        function basename(path) {
            return path.split('/').pop();
        }

        /**
         * Returns parent directory's path.
         * @memberof core/filesystem
         * @param {string} path File path.
         * @return {string} Dir name.
         */
        function dirName(path) {
            return path.split('/').slice(0, -1).join('/');
        }

        /**
         * Converts URI to system path.
         * @memberof core/filesystem
         * @param {string} uri Uri.
         * @return {string} Returns system path for specified uri.
         */
        function getSystemPath(uri) {
            return uri.replace(URI_PREFIX, '');
        }

        /**
         * Extracts file extension from file name.
         * @param {string} fileName File name.
         * @param {bool} [addDot] If a dot should be added in front
         * of the extension, 'true' by default.
         * @memberof core/filesystem
         * @return {string} extension for specified file name.
         */
        function getFileExtension(fileName, addDot) {
            var splittedFileName = fileName.split('.'),
                ext = '';

            if (splittedFileName.length > 1) {
                ext = splittedFileName.pop();
                if (addDot !== false) {
                    ext = '.' + ext;
                }
            }
            return ext;
        }

        /**
         * Returns file name without extension.
         * @memberof core/filesystem
         * @param {string} fileName Filename.
         * @return {string} fileName  Filename without extension.
         */
        function getFilenameWithoutExtension(fileName) {
            var splittedFileName = fileName.split('.');
            if (splittedFileName.length > 1) {
                fileName = splittedFileName.slice(0, -1).join('.');
            }

            return fileName;
        }

        /**
         * Returns true if filename starts with a dot.
         * @memberof core/filesystem
         * @param {string} fileName File name.
         * @return {boolean} Hidden.
         */
        function isHiddenFile(fileName) {
            return (fileName[0] === '.') ? true : false;
        }


        /**
         * Creates new empty file in specified location.
         * @memberof core/filesystem
         * @param {File} directoryHandle Directory handle.
         * @param {string} fileName File name.
         * @return {File} Created file.
         */
        function createFile(directoryHandle, fileName) {
            try {
                return directoryHandle.createFile(fileName);
            } catch (e) {
                console.error('Filesystem_createFile error:' + e.message);
            }
            return null;
        }

        /**
         * Creates new empty directory in specified location.
         * @memberof core/filesystem
         * @param {File} directoryHandle Directory handle.
         * @param {string} dirName Directory name.
         * @return {File} Created directory.
         */
        function createDir(directoryHandle, dirName) {
            try {
                return directoryHandle.createDirectory(dirName);
            } catch (e) {
                console.error('Filesystem_createDir error:' + e.message);
            }
            return null;
        }

        /**
         * Writes content to file stream.
         * @memberof core/filesystem
         * @param {File} handle file handler.
         * @param {string} content file content.
         * @param {function} suc on success callback.
         * @param {function} err on error callback.
         * @param {string} encoding content encoding.
         */
        function writeFile(handle, content, suc, err, encoding) {
            err = err || noop;

            handle.openStream('w', function writeFile(fileStream) {
                if (encoding === 'base64') {
                    fileStream.writeBase64(content);
                } else {
                    fileStream.write(content);
                }

                fileStream.close();

                // launch onSuccess callback
                if (typeof suc === 'function') {
                    suc();
                }
            }, err, 'UTF-8');
        }

        /**
         * Opens specified location.
         * @memberof core/filesystem
         * @param {string} path directory path.
         * @param {function} onSuccess on success callback.
         * @param {function} onError on error callback.
         * @param {string} openMode mode.
         */
        function openDir(path, onSuccess, onError, openMode) {
            openMode = openMode || 'rw';
            onSuccess = onSuccess || noop;

            try {
                tizen.filesystem.resolve(path, onSuccess, onError, openMode);
            } catch (e) {
                onError(e);
            }
        }

        /**
         * Parses specified filepath and returns data parts.
         * @memberof core/filesystem
         * @param {string} filePath File path.
         * @return {object} Data parts.
         */
        function getPathData(filePath) {
            var path = {
                originalPath: filePath,
                fileName: '',
                dirName: ''
            },
                splitPath = filePath.split('/');

            path.fileName = splitPath.pop();
            path.dirName = splitPath.join('/') || '/';

            return path;
        }

        /**
         * Saves specified content to file.
         * @memberof core/filesystem
         * @param {string} path File path.
         * @param {string} content File content.
         * @param {function} suc Save success callback.
         * @param {string} encoding File encoding.
         */
        function saveFileContent(path, content, suc, encoding) {
            var pathData = getPathData(path),
                fileHandle;

            function onOpenDirSuccess(dir) {
                // create new file
                fileHandle = createFile(dir, pathData.fileName);
                if (fileHandle !== false) {
                    // save data into this file
                    writeFile(
                        fileHandle,
                        content,
                        suc,
                        false,
                        encoding
                    );
                }
            }

            // open directory
            openDir(pathData.dirName, onOpenDirSuccess);
        }

        /**
         * Deletes specified file.
         * @memberof core/filesystem
         * @param {File} dir Directory.
         * @param {string} path File path.
         * @param {function} onSuccess Delete success callback.
         * @param {function} onErr Delete error callback.
         */
        function deleteFile(dir, path, onSuccess, onErr) {
            try {
                dir.deleteFile(path, onSuccess, onErr);
            } catch (e) {
                console.error('Filesystem_deleteFile error: ' + e.message);
                if (typeof onErr === 'function') {
                    onErr(e);
                }
            }
        }

        /**
         * Deletes specified directory.
         * @memberof core/filesystem
         * @param {File} dir Directory.
         * @param {string} path Dir path.
         * @param {function} onSuccess Delete success callback.
         * @param {function} onError Delete error callback.
         */
        function deleteDir(dir, path, onSuccess, onError) {
            try {
                dir.deleteDirectory(path, false, onSuccess, onError);
            } catch (e) {
                console.error('Filesystem_deleteDir error:' + e.message);
                if (typeof onError === 'function') {
                    onError(e);
                }
            }
        }

        function onDeleteError(e) {
            console.error('Filesystem_deleteNode:_onDeleteError', e);
        }

        /**
         * Deletes node with specified path
         * @memberof core/filesystem
         * @param {string} nodePath node path.
         * @param {function} onSuccess success callback.
         */
        function deleteNode(nodePath, onSuccess) {
            var pathData = getPathData(nodePath);

            function onOpenDirSuccess(dir) {
                var onListFiles = function onListFiles(files) {
                    var del = null;
                    if (files.length > 0) {
                        // File exists.
                        if (files[0].isDirectory) {
                            del = deleteDir;
                        } else {
                            del = deleteFile;
                        }

                        del(
                            dir,
                            files[0].fullPath,
                            onSuccess,
                            onDeleteError
                        );
                    } else {
                        onSuccess();
                    }
                };

                // check file exists
                dir.listFiles(onListFiles, function error(e) {
                    console.error(e);
                }, {
                    name: pathData.fileName
                });
            }

            openDir(pathData.dirName, onOpenDirSuccess, function error(e) {
                console.error('Filesystem_openDir error: ' + e.message);
            });
        }

        /**
         * Gets a list of storages.
         * @memberof core/filesystem
         * @param {string} type Storage type.
         * @param {function} onSuccess Success callback.
         * @param {string} excluded Excluded storage.
         */
        function getStorages(type, onSuccess, excluded) {
            tizen.filesystem.listStorages(function getStorages(storages) {
                var tmp = [];

                if (type !== undefined) {
                    tmp = storages.filter(function filter(value) {
                        // filter by label and type
                        return value.label !== excluded &&
                            (value.type === 0 || value.type === type);
                    });
                } else {
                    tmp = storages;
                }

                if (typeof onSuccess === 'function') {
                    onSuccess(tmp);
                }
            });
        }

        /**
         * Get list of files in directory.
         * @param {File} dir Directory.
         * @param {function} onSuccess Success callback.
         * @memberof core/filesystem
         */
        function getFilesList(dir, onSuccess) {
            try {
                dir.listFiles(
                    function getFiles(files) {
                        var tmp = [],
                            len = files.length,
                            i;

                        for (i = 0; i < len; i += 1) {
                            tmp.push(files[i].name);
                        }

                        if (typeof onSuccess === 'function') {
                            onSuccess(tmp);
                        }
                    },
                    function error(e) {
                        console.error(
                            'Filesystem_getFilesList dir.listFiles() error: ' +
                                e.message
                        );
                    }
                );
            } catch (e) {
                console.error('Filesystem_getFilesList error: ' + e.message);
            }
        }

        /**
         * Get list of files in directory.
         * @memberof core/filesystem
         * @param {string} path Directory path.
         * @param {function} [onSuccess] On success callback.
         * @param {function} [onError] On error callback.
         * @param {string} [fileMask] File mask.
         */
        function dir(path, onSuccess, onError, fileMask) {
            onSuccess = onSuccess || noop;
            onError = onError || noop;
            fileMask = fileMask || '';

            function onOpenDir(dir) {
                var exc;
                if (typeof dir !== 'object') {
                    exc = {message: 'dir is not an object'};
                    throw exc;
                }
                if (dir.isDirectory !== true) {
                    exc = {message: 'dir is not instance of File'};
                    throw exc;
                }
                fileMask = (fileMask && typeof fileMask === 'string') ?
                        {name: fileMask} : fileMask;

                dir.listFiles(function success(files) {
                    onSuccess(files, dir);
                }, onError, null);
            }

            function onOpenDirError(e) {
                console.error('onOpenDirError: ' + e.message);
                onError(e);
            }

            try {
                openDir(path, onOpenDir, onOpenDirError, 'rw');
            } catch (e) {
                console.error('Filesystem_dir error: ' + e.message);
            }
        }

        return {
            basename: basename,
            dirName: dirName,
            getSystemPath: getSystemPath,
            getFileExtension: getFileExtension,
            getFileNameWithoutExtension: getFilenameWithoutExtension,
            isHiddenFile: isHiddenFile,

            dir: dir,
            openDir: openDir,
            writeFile: writeFile,
            createFile: createFile,
            createDir: createDir,
            deleteDir: deleteDir,
            deleteFile: deleteFile,
            deleteNode: deleteNode,
            getFilesList: getFilesList,
            getPathData: getPathData,
            getStorages: getStorages,
            saveFileContent: saveFileContent
        };
    }
);
