var ContextHook = function (context) {
    
    this.frameContextHooks = [];
    this.context = context;

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
        console.log(newHook);
        return this.frameContextHooks.push(newHook) - 1;
    };

    this.unregisterHook = function(hookIndex){
        this.frameContextHooks.splice(hookIndex, 1);
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