"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVersionById = getVersionById;
function getVersionById(versions, id = null) {
    if (id != null) {
        return versions.find(version => version.id === id);
    }
    return [...versions]
        .filter(version => !['Unreleased', 'unreleased'].includes(version.id))
        .shift();
}
