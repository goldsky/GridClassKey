var GridClassKey = function(config) {
    config = config || {};
    GridClassKey.superclass.constructor.call(this, config);
};
Ext.extend(GridClassKey, Ext.Component, {
    page: {}, window: {}, grid: {}, tree: {}, panel: {}, combo: {}, config: {}, view: {}, extra: {}
    , connector_url: ''
});
Ext.reg('gridclasskey', GridClassKey);

GridClassKey = new GridClassKey();

/**
 * 
 * @param {type} needle
 * @link http://stackoverflow.com/a/1181586
 */
var indexOf = function(needle) {
    if(typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                if(this[i] === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle);
};