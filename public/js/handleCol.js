export const addHandleCol = (that) => {
    that.handleColissionX = (object) => {
        if(that.velocity.x > 0) that.pos.x = object.pos.x - that.size.x;
        else that.pos.x = object.pos.x + object.size.x;
    }
    that.handleColissionY = (object) => {
        if(that.velocity.y > 0){
            that.grounded = true;
            that.pos.y = object.pos.y - that.size.y;
        }else that.pos.y = object.pos.y + object.size.y;
        that.velocity.y = 0;
    }
    that.handlePlatCol = (object) => {
        if(that.velocity.y > 0){
            that.pos.y = object.pos.y - that.size.y;
            that.grounded = true;
            that.velocity.y = 0;
        }
    }
}

export const addHandleColBounce = (that) => {
    that.handleColissionX = that.handleOubX = () => {
        that.dir *= -1;
        that.pos.x += that.dir*4;
    }
    that.handleColissionY = (object) => {
        if(that.velocity.y > 0){
            that.grounded = true;
            that.pos.y = object.pos.y - that.size.y;
        }else that.pos.y = object.pos.y + object.size.y;
        that.velocity.y = 0;
    }
    that.handlePlatCol = (object) => {
        if(that.velocity.y > 0){
            that.pos.y = object.pos.y - that.size.y;
            that.grounded = true;
            that.velocity.y = 0;
        }
    }
}