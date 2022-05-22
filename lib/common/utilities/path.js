"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchPath = exports.ProcessPathPlaceholders = void 0;
const PlaceholderTypes = ['integer', 'number', 'string', 'boolean', 'array'];
function ProcessPathPlaceholders(path) {
    if (typeof path !== 'string') {
        return null;
    }
    let params = [...path.matchAll(/\/(\:[^\/]+)/g)].map(item => item[1].split(':').map(part => part.trim()).filter(part => !!part)).filter(param => (param.length <= 2));
    if (params.length != 0) {
        return path.split('/').map(part => part.trim()).filter(part => !!part).map((part) => {
            let [key, type] = (params.find(param => (`:${param.join(':')}` === part)) || []);
            if (!key) {
                return part;
            }
            let isOptional = part.endsWith('?');
            return { isOptional,
                value: (isOptional ? key.substring(0, (key.length - 1)) : key),
                type: ((type && PlaceholderTypes.includes(type)) ? type : undefined),
            };
        });
    }
    return null;
}
exports.ProcessPathPlaceholders = ProcessPathPlaceholders;
function MatchPath(path, info, params, pathParts) {
    Object.keys(params).forEach(key => (delete params[key]));
    let targetPath = info.fetcher.GetPath();
    if (typeof targetPath !== 'string') {
        return targetPath.test(path);
    }
    if (!info.optimized) {
        return (targetPath === path);
    }
    pathParts = (pathParts || path.split('/').map(part => part.trim()).filter(part => !!part));
    let pathIndex = 0, paramsIndex = 0, lastPlaceholderIndex = { path: -1, params: -1 }, gotoCheckpoint = () => {
        if (lastPlaceholderIndex.path != -1 && lastPlaceholderIndex.params != -1) { //Continue from the last optional param
            pathIndex = lastPlaceholderIndex.path;
            paramsIndex = (lastPlaceholderIndex.params + 1);
            delete params[info.optimized[lastPlaceholderIndex.params].value];
            lastPlaceholderIndex = { path: -1, params: -1 };
            return true;
        }
        return false;
    };
    let pathIsMatched = (path, targetPath) => {
        return ((targetPath.startsWith('%') && targetPath.endsWith('%')) ? (new RegExp(targetPath.substring(1, (targetPath.length - 1))).test(path)) : (path === targetPath));
    };
    for (; pathIndex < pathParts.length && paramsIndex < info.optimized.length;) {
        let param = info.optimized[paramsIndex], segment = pathParts[pathIndex];
        if (typeof param === 'string' && !pathIsMatched(segment, param)) { //Segments don't match
            if (gotoCheckpoint()) {
                continue;
            }
            return false;
        }
        if (typeof param !== 'string') {
            let accept = (value) => {
                params[param.value] = value; //Add param value
                if (param.isOptional && lastPlaceholderIndex.path == -1 && lastPlaceholderIndex.params == -1) { //Update checkpoint
                    lastPlaceholderIndex = { path: pathIndex, params: paramsIndex };
                }
            };
            if (param.type && param.type !== 'string') { //Validate types
                if (param.type === 'integer' || param.type === 'number') {
                    let numValue = parseFloat(segment);
                    if (numValue || numValue === 0) {
                        if (param.type === 'number' || Number.isInteger(numValue)) {
                            accept(numValue);
                        }
                        else if (!param.isOptional) {
                            return false;
                        }
                    }
                    else if (!param.isOptional) {
                        return false;
                    }
                }
                else if (param.type === 'boolean') {
                    if (segment === 'true' || segment === 'false') {
                        accept(segment === 'true');
                    }
                    else if (!param.isOptional) {
                        return false;
                    }
                }
                else { //Array
                    accept(segment.split(',').map(part => part.trim()).filter(part => !!part));
                }
            }
            else {
                accept(segment);
            }
        }
        ++pathIndex;
        ++paramsIndex;
        if (pathIndex >= pathParts.length && paramsIndex < info.optimized.length) {
            param = info.optimized[paramsIndex];
            if (info.optimized.slice(paramsIndex).findIndex((param) => {
                return (typeof param === 'string' || !param.isOptional);
            }) != -1 && !gotoCheckpoint()) { //There's a non-optional part ahead -- try last checkpoint
                return false;
            }
        }
    }
    if (pathIndex < pathParts.length) { //Not fully matched
        return false;
    }
    for (; paramsIndex < info.optimized.length; ++paramsIndex) {
        let param = info.optimized[paramsIndex];
        if (typeof param === 'string' || !param.isOptional) { //Not fully matched
            return false;
        }
    }
    return true;
}
exports.MatchPath = MatchPath;
