const addAnimate = (that, { frames = [[0, 0, 30, 30]], delay = 1, handleFrames }) => {
    let delta = 0;
    let frame = 0;
    that.animate = (WORLD) => {
        if(handleFrames) frames = handleFrames(WORLD);
        if(frames.length > 0){
            delta += 1;
            if(delta % delay === 0){
                frame += 1;
                if(frame >= frames.length) frame = 0;
                that.imgPos = frames[frame];
            }
        }
    }
}

export default addAnimate;