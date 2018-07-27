/*
    context hook for specific events.
*/
// TODO: Maybe make extended types of this class
export default  function (context) {
    
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
        return this.frameContextHooks.push(newHook) - 1;
    };

    this.unregisterHook = function(hookIndex){
        this.frameContextHooks.splice(hookIndex, 1);
    };

    this.unregisterAllHooks = function () {
        this.frameContextHooks = [];
    };

};