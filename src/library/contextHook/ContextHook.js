
class Hook {

    constructor(hookBody){
        this.name = hookBody.name;
        this.callbackHook = hookBody.callbackHook;
    }

}

class ContextHook {

    _frameContextHooks = [];

    runContextHooks (context){

        if(this._frameContextHooks){
            this._frameContextHooks.forEach(function(contextHook){
                
                if(contextHook.name == context.name){
                    contextHook.callbackHook(context);
                }

            });
        }

    };

    initializeContextHook (hook) {
        hook.callbackHook(this.context);
    };

    registerHooks (newHook){
        let hook = new Hook(newHook);
        this._frameContextHooks.push(hook);
        return hook;
    };

    unregisterHook (deleteHook){
        this._frameContextHooks.splice(
            this. _frameContextHooks.findIndex(hook => deleteHook === hook), 1);
    };

    unregisterAllHooks () {
        this._frameContextHooks = [];
    };

    constructor(context){
        this.context = context;
    }

};

class ContextManager {

    static _parents = []

    static _findHookParent (name) {
        return this._parents.find(function(hooks) {
            return hooks.name == name;
        });
    }

    static createHook (parentName, context) {

        var contextHook = new ContextHook(context);

        this._parents.push({
            name: parentName, 
            contextHook: contextHook
        });

        return contextHook;
    }

    static unbindAllFrameHooks () {
        this._parents.forEach(function(hooks){
            hooks.contextHook.unregisterAllHooks();
        })
    }

    static unbindFrameHook (name, hookIndex) {
        this._findHookParent(name).unregisterHook(hookIndex);
    }

}


export default ContextManager;