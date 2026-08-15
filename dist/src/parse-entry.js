"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseEntry = parseEntry;
const semver_1 = require("semver");
function parseEntry(entry) {
    const [title, ...other] = entry
        .trim()
        .split('\n');
    const [versionPart, datePart] = title.split(' - ');
    const versionMatch = versionPart.match(/[a-zA-Z0-9.\-+]+/);
    const versionNumber = versionMatch ? versionMatch[0] : '';
    const dateMatch = datePart != null && datePart.match(/[0-9-]+/);
    const versionDate = dateMatch ? dateMatch[0] : undefined;
    return {
        id: versionNumber,
        date: versionDate || undefined,
        status: computeStatus(versionNumber, title),
        text: other
            .filter(item => !/\[.*\]: http/.test(item))
            .join('\n')
    };
}
function computeStatus(version, title) {
    if ((0, semver_1.prerelease)(version)) {
        return 'prereleased';
    }
    if (title.match(/\[yanked\]/i)) {
        return 'yanked';
    }
    if (title.match(/\[unreleased\]/i)) {
        return 'unreleased';
    }
    return 'released';
}
