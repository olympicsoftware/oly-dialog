const defaultName = 'defaultDialog';

export default class DialogRegistry {
    /// <summary>
    /// A global registry of dialogs which allows them to be retrieved
    /// and controlled from Controllers/Services.
    /// If there is only one dialog, the name parameters are optional.
    /// </summary>
    constructor() {
        this.dialogs = {};
    }

    addDialog(dialog, name) {
        this.dialogs[name || defaultName] = dialog;
    }

    removeDialog(name) {
        delete this.dialogs[name || defaultName];
    }

    getDialog(name) {
        return this.dialogs[name || defaultName];
    }

    getDialogs() {
        return this.dialogs;
    }
}