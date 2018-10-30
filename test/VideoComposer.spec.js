import templates from './videoComposer.template.js';

import VideoComposer from '../src/vue_plugin/VidComp/VideoComposerFacade';

var compProject = new VideoComposer();
var canvasTarget = document.createElement("canvas");

describe('Project initialization', () => {

  it('Create new project', () => {

    expect(compProject.loadProject(templates.blankProject)).to.be.equal(true);

  });

  describe('Return corresponding verification', () => {

    it('Layer length', () => {

      expect(compProject.getProject(templates.blankProject.name)
      .getAllLayers().length).to.be.equal(1);

    })

    it('Media length', () => {

      expect(compProject.getProject(templates.blankProject.name)
      .getAllMedia().length).to.be.equal(0);

    })
    //TODO: More corresponding info

  });

  describe('Connect to canvas', () => {

    it('videoProject target same as connected canvas', () => {

      expect(compProject.getProject(templates.blankProject.name)
      .setTarget(canvasTarget).el).to.be.equal(canvasTarget);

    })

  });

  describe('Add media with resource', () => {

    it('Add media to layer', () => {

      expect(compProject.getProject(templates.blankProject.name)
      .addMedia(templates.mediaResource).mediaIndex).to.be.equal(0);

    })

    it('Resource loaded', (done) => {

      compProject.getProject(templates.blankProject.name).getMedia(0,0)
      .resource.loadedResource.then( (result) => {
        expect(result.url).to.not.equal('fetching');
      }).then(done, done);

    });

    it('Media length', () => {

      expect(compProject.getProject(templates.blankProject.name)
      .getAllMedia().length).to.be.equal(1);

    })

    it('Video sources length', () => {

      expect(compProject.getProject(templates.blankProject.name)
      .sourceLoader.getVideoSources().length).to.be.equal(1);

    })

    it('Audio sources length', () => {

      expect(compProject.getProject(templates.blankProject.name)
      .sourceLoader.getAudioSources().length).to.be.equal(0);

    })

  });

});

describe('Playback', () => {
  
  it('Start', () => {

    expect(compProject.getProject(templates.blankProject.name)
    .play());
    
  });

  it('Play for 3s', (done) => {

    setTimeout(function(){

      expect(compProject.getProject(templates.blankProject.name)
      .videoProjection.playbackContainer.timeTracker.elapsedDateTime).to.be.above(3000);
      done();

    }, 3500)

  }).timeout(4000);

  it('Stop ', () => {

    expect(compProject.getProject(templates.blankProject.name)
    .stop());

  })

  it('Reset ', () => {

    expect(compProject.getProject(templates.blankProject.name)
    .reset());

  })

  it('Time head at reset', () => {

    expect(compProject.getProject(templates.blankProject.name)
    .videoProjection.playbackContainer
    .timeTracker.elapsedDateTime).to.be.equal(0);

  })

});

describe('Media shifting', () => {

  it('Adjust media close', () => {

      expect(compProject.getProject(templates.blankProject.name)
      .adjustMediaShift({
              layerIndex: 0, mediaIndex: 0
          },{
              layerIndex: 0,
              timelineStartTime: templates.closeTimeline
      }));

  });

  it('Timeline time at start', () => {

    expect(compProject.getProject(templates.blankProject.name)
    .getMedia(0,0).timelineTime[0]).to.be.equal(0.155);

  });

  it('Timeline time at end', () => {

    expect(compProject.getProject(templates.blankProject.name)
    .getMedia(0,0).timelineTime[1]).to.be.equal(0.455);

  });

});