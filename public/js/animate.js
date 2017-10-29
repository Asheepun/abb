const getAnimate = (entity, { frames, delay, handleFrames = (frames) => {} }) => {
    let delta = 0;
    let frame = 0;
    return ({ timeScl }) => {
        frames = handleFrames(frames);
        delta += 1;
        if(delta % delay === 0){
            frame += 1;
            if(frame >= frames.length) frame = 0;
            entity.imgPos = frames[frame];
        }
    }
}

export default getAnimate;