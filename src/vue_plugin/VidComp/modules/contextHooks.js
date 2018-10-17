var ContextHook = function (context) {
    
    this.frameContextHooks = [];
    this.context = context;

    class Hook {

        constructor(hookBody){

            this.name = hookBody.name;
            this.callbackHook = hookBody.callbackHook;

        }

    }

    this.runContextHooks = function (context){

        if(this.frameContextHooks){

            this.frameContextHooks.forEach(function(contextHook){
                
                if(contextHook.name == context.name){
                    contextHook.callbackHook(context);
                }

            });

        }

    };

    this.initializeContextHook = function (hook) {
        hook.callbackHook(this.context);
    };

    this.registerHooks = function (newHook){

        var hook = new Hook(newHook);
        this.frameContextHooks.push(hook);
        return hook;

    };

    this.unregisterHook = function(deleteHook){

        this.frameContextHooks.splice(
        this.frameContextHooks.findIndex(hook => deleteHook === hook), 1);
        
    };

    this.unregisterAllHooks = function () {
        this.frameContextHooks = [];
    };

};

var contextManager = {

    parents: [],

    findHookParent: function (name) {

        return contextManager.parents.find(function(hooks) {
            return hooks.name == name;
        });

    },

    createHook: function (parentName, context){

        var contextHook = new ContextHook(context);

        contextManager.parents.push({
            name: parentName, 
            contextHook: contextHook
        });

        return contextHook;

    },

    unbindAllFrameHooks: function () {

        contextManager.parents.forEach(function(hooks){
            hooks.contextHook.unregisterAllHooks();
        })

    },

    unbindFrameHook: function (name, hookIndex) {

        var contextHook = findHookParent(name);
        contextHook.unregisterHook(hookIndex);
        
    }

}


export default {
    createHook: contextManager.createHook,
    unbindFrameHook: contextManager.unbindFrameHook,
    unbindAllFrameHooks: contextManager.unbindAllFrameHooks
}