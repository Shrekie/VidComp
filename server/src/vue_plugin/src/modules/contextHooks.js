/*
    bind hooks on specific actions
*/
// TODO: make base class and inherit for specific classes
// TODO: also after above make it mixin?
export default function (drawingContext) {

    // TODO: make this run only when needed

    if(drawingContext) this.drawingContext = drawingContext;
    this.frameContextHooks = [];

    this.runContextHooks = function (context){
        if(this.frameContextHooks){
            this.frameContextHooks.forEach(function(contextHook, index){

                if(context.name == 'drawingUpdate' && 
                context.name == context.name){
                    contextHook.callbackHook(this.drawingContext);
                }

                if(context.name == 'beforeActionStart' && 
                contextHook.name == context.name){
                    console.log('dont run on draw ' + context.name);
                    contextHook.callbackHook(context.action, this.drawingContext);
                }

                // FIXME: probably remove, wont need anything like this.
                if(context.name == 'addedMedia' && 
                    contextHook.name == context.name){
                    contextHook.callbackHook(context.media, this.drawingContext);
                }

            }.bind(this));
        }
    };

    this.initializeContextHooks = function (name, callbackHook) {
        if(name == 'drawingUpdate')
            callbackHook(this.drawingContext);
    };

    this.registerHooks = function (newHook){
        this.initializeContextHooks(newHook.name, newHook.callbackHook);
        this.frameContextHooks.push(newHook);
    };

    this.unregisterHooks = function () {
        // TODO: add argument for which to unregister
        this.frameContextHooks = [];
    };

};