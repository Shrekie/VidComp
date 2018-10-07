/*
    Determines blob file type specifics
*/
var BlobAnalyzer = function () {
    var fileTypes = ["image", "video", "audio"];
    this.determineType = function (blob){
        let fileType = "undefined";
        fileTypes.forEach(function(type){
            if(blob.type.includes(type)){
                fileType = type;
            }
        });
        return fileType;
    }
};
export default BlobAnalyzer;