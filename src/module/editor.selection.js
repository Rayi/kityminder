//模拟光标
Minder.Selection = kity.createClass( 'Selection', {
    base: kity.Rect,
    constructor: function ( height, color, width ) {
        this.callBase();
        this.height = height || 20;
        this.setAttr('id','_kity_selection');
        this.width = 2;
        this.fill('rgb(27,171,255)');
        this.setHide();
        this.timer = null;
        this.collapsed = true;
        this.startOffset = this.endOffset = 0;
        this.setOpacity(0.5);
        this.setStyle('cursor','text');
        this._show = false;

    },
    setColor:function(color){
        this.fill(color);
    },
    collapse : function(toEnd){
        this.setOpacity(1);
        this.width = 2;
        this.collapsed = true;
        if(toEnd){
            this.startOffset = this.endOffset;
        }else{
            this.endOffset = this.startOffset;
        }
        return this;
    },
    setStartOffset:function(offset){
        this.startOffset = offset;
        var tmpOffset = this.startOffset;
        if(this.startOffset > this.endOffset){
            this.startOffset = this.endOffset;
            this.endOffset = tmpOffset;
        }else if(this.startOffset == this.endOffset){
            this.collapse();
            return this;
        }
        this.collapsed = false;
        this.setOpacity(0.5);
        return this;
    },
    setEndOffset:function(offset){
        this.endOffset = offset;
        var tmpOffset = this.endOffset;
        if(this.endOffset < this.startOffset){
            this.endOffset = this.startOffset;
            this.startOffset = tmpOffset;
        }else if(this.startOffset == this.endOffset){
            this.collapse();
            return this;
        }
        this.collapsed = false;
//        this.stroke('none',0);
        this.setOpacity(0.5);
        return this;
    },
    updateShow : function(offset,width){
        if(width){
            this.setShowHold();
        }
        this.setPosition(offset).setWidth(width);
        this.bringTop();
        return this;
    },
    setPosition: function ( offset ) {
        try {
            // 这两个是神奇的 0.5 —— SVG 要边缘锐利，你需要一些对齐
            this.x = Math.round(offset.x) - 0.5;
            this.y = Math.round(offset.y) - 1.5;

        } catch ( e ) {
           console.log(e);
        }
        this.update();
        return this;
    },
    setHeight: function ( height ) {
        this.height = Math.round(height) + 2;
        return this;
    },
    setHide: function () {
        clearInterval( this.timer );
        this.setStyle( 'display', 'none' );
        this._show = false;
        return this;
    },
    setShowHold: function () {
        clearInterval( this.timer );
        this.setStyle( 'display', '' );
        this._show = true;
        return this;
    },
    setShow: function () {
        clearInterval( this.timer );
        var me = this,
            state = '';

        me.setStyle( 'display', '' );
        me._show = true;
        if(this.collapsed){
            me.setOpacity(1);
            this.timer = setInterval( function () {
                me.setStyle( 'display', state );
                state = state ? '' : 'none';
            }, 400 );
        }
        return this;
    },
    isShow:function(){
        return this._show;
    },
    isHide:function(){
        return !this._show;
    },
    clearBaseOffset:function(){
        this.baseOffset = this.currentEndOffset = null;
    }
} );