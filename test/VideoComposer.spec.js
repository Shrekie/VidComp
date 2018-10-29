import templates from './videoComposer.template.js';

import VideoComposer from '../src/vue_plugin/VidComp/VideoComposerFacade';
var compProject = new VideoComposer();

var canvasTarget = document.createElement("canvas");

describe('Project initialization', () => {

  it('Create new project', () => {

    expect(compProject.loadProject(templates.blankProject)).to.be.equal(true);

  })

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

  })

  describe('Connect to canvas', () => {

    it('videoProject target same as connected canvas', () => {

      expect(compProject.getProject(templates.blankProject.name)
      .setTarget(canvasTarget).el).to.be.equal(canvasTarget);

    })

  })

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

    })

    it('Media length', () => {

      expect(compProject.getProject(templates.blankProject.name)
      .getAllMedia().length).to.be.equal(1);

    })

  })

});