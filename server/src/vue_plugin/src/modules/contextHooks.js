/*
    context hook for specific events.
*/
// TODO: Maybe add context hook for media changes?
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
        this.frameContextHooks.push(newHook);
    };

    this.unregisterHooks = function () {
        // TODO: add argument for which to unregister
        this.frameContextHooks = [];
    };

};