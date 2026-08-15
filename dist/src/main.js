"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
const util_1 = require("util");
const fs_1 = require("fs");
const core = __importStar(require("@actions/core"));
const validate_entry_1 = require("./validate-entry");
const parse_entry_1 = require("./parse-entry");
const get_entries_1 = require("./get-entries");
const get_version_by_id_1 = require("./get-version-by-id");
const readFile = (0, util_1.promisify)(fs_1.readFile);
async function main() {
    try {
        const changelogPath = core.getInput('path') || './CHANGELOG.md';
        const targetVersion = core.getInput('version') || null;
        const validationDepth = parseInt(core.getInput('validation_depth') || '0', 10);
        if (targetVersion == null) {
            core.warning(`No target version specified. Will try to return the most recent one in the changelog file.`);
        }
        core.startGroup('Parse changelog data');
        const rawData = await readFile(changelogPath);
        const versions = (0, get_entries_1.getEntries)(rawData)
            .map(parse_entry_1.parseEntry);
        core.info(`versions: ${versions}`);
        if (validationDepth != 0) {
            const releasedVersions = versions.filter(version => version.status != 'unreleased');
            releasedVersions
                .reverse()
                .slice(Math.max(0, releasedVersions.length - validationDepth))
                .forEach(validate_entry_1.validateEntry);
        }
        core.info(`${versions.length} version logs found`);
        core.endGroup();
        const version = (0, get_version_by_id_1.getVersionById)(versions, targetVersion);
        if (version == null) {
            throw new Error(`No log entry found${targetVersion != null
                ? ` for version ${targetVersion}`
                : ''}`);
        }
        core.setOutput('version', version.id);
        core.setOutput('date', version.date);
        core.setOutput('status', version.status);
        core.setOutput('changes', version.text);
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
