"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEntry = validateEntry;
const semver_1 = require("semver");
const known = [];
function validateEntry(entry, idx) {
    if (entry.status == 'unreleased')
        return; // no validation on unreleased versions
    if (!(0, semver_1.valid)(entry.id)) { // Validate version is semantically correct
        throw new Error(`${entry.id} is not a valid semantic version.`);
    }
    if (known[idx])
        known.length = 0; // reset known -- used by tests to reset value
    const lastVersion = known.length ? known[known.length - 1] : null;
    known.push(entry.id);
    if (lastVersion && !(0, semver_1.lt)(lastVersion, entry.id)) { // Validate versions appear in reverse chronological order
        throw new Error(`Changelog versions out of order. Version ${entry.id} cannot come after ${lastVersion}.`);
    }
    const entryText = entry.changes || entry.text; // backwards compatible
    const changes = entryText
        .split(/^###\s*/gm)
        .filter((content) => content.replace(/\s+/g, '') != '')
        .map((content) => {
        const [type, ...items] = content.trim().split(/\r*\n/);
        return { type: type.toLowerCase().trim(), items };
    });
    changes.forEach((change) => {
        if (!change.items.length) { // Validate that there are changes listed under each section
            throw new Error(`The '${change.type}' section under version ${entry.id} does not contain any listed changes under the heading.`);
        }
    });
    if (!lastVersion)
        return; // No further validation needed because there is no previous version to compare against
    const versionDiff = (0, semver_1.diff)(lastVersion, entry.id);
    const allowedTypes = [];
    switch (versionDiff) {
        case 'prerelease':
        case 'prepatch':
        case 'patch':
            allowedTypes.push('fixed', 'security');
            break;
        case 'minor':
        case 'preminor':
            allowedTypes.push('added', 'changed', 'deprecated', 'fixed', 'security');
            break;
        default:
            allowedTypes.push('added', 'removed', 'changed', 'deprecated', 'fixed', 'security');
            break;
    }
    if (allowedTypes.length) {
        const disallowedTypes = changes
            .map((change) => change.type)
            .filter((type) => allowedTypes.indexOf(type) === -1);
        if (disallowedTypes.length) { // Validates that only certain allowed types are in the change set
            throw new Error(`The section${(disallowedTypes.length == 1 ? '' : 's')} '${disallowedTypes.join(', ')}' under version ${entry.id} ${(disallowedTypes.length == 1 ? 'is' : 'are')} not allowed in a ${versionDiff} release type.`);
        }
    }
}
