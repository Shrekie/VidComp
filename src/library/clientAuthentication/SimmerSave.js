class SimmerSave {

    static _changeFlag = false;
    static _saveCamping = false;
    static _activeInterval = false;
    static _activeCB = false;

    static AUTOSAVE_TIMER = 2500;

    static autoSave (cb) {

        this._activeCB = cb;

        this._changeFlag = true;
        if(!this._saveCamping){
            this._saveCamping = true;
            this._cycleSave();
        }

    }

    static _boilFlag () {

        if(!this._changeFlag){
            this._activeCB();
            clearInterval(this._activeInterval);
            this._saveCamping = false;
        }else{
            this._changeFlag = false;
        }

    }

    static _cycleSave () {
        this._activeInterval = 
        setInterval(this._boilFlag.bind(this), this.AUTOSAVE_TIMER);
    }

    
}

export default SimmerSave;