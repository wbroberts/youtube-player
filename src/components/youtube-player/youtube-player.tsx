import { Component, Prop, State, Element, Method } from '@stencil/core';

import { Video } from '../../models/video.model';
import { EnvVar } from '../../env/env.variables';

@Component({
  tag: 'youtube-player',
  styleUrl: 'youtube-player.css',
  shadow: true
})
export class PlayerContainer {
  // Variables
  private player: HTMLElement;
  private url: string = 'https://www.googleapis.com/youtube/v3/';

  // Elements
  @Element() el: HTMLElement;

  // States
  @State() isLoading: boolean = true;
  @State() video: Video = {
    title: null,
    img: null
  };

  // Props
  @Prop() apiKey: string = EnvVar.YT_KEY;
  @Prop() id: string;

  // Lifecycle
  componentWillLoad() {
    this.fetchVideoData(this.id);
  }
  componentDidLoad() {
    this.createYTPlayerDiv();
  }

  // Methods
  private createYTPlayerDiv() {
    this.player = document.createElement('div');
    this.player.id = 'player';
    this.el.shadowRoot.querySelector('.card').appendChild(this.player);
  }
  private async fetchVideoData(videoId: string): Promise<void> {
    this.isLoading = true;

    await fetch(`${this.url}videos?part=snippet&id=${videoId}&key=${this.apiKey}`)
      .then(res => res.json())
      .then(res => {
        this.isLoading = false;
        const vid = res.items[0].snippet;

        this.video.img = vid.thumbnails.medium.url;
        this.video.title = vid.title;
      })
      .catch(e => console.log(e));
  }
  private iFramePlayer() {
    window['onYouTubeIframeAPIReady'] = () => {
      new window['YT'].Player(this.player, {
        videoId: this.id,
        width: '320',
        height: '180',
        events: {
          onError: () => console.log('Error'),
          onReady: e => {
            console.log('playing');
            e.target.playVideo();
          }
        }
      });
    };
  }
  private initYT() {
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.onload = () => {
      console.log('YT Script loaded');
      this.iFramePlayer();
    };
    document.body.appendChild(script);
  }
  @Method()
  playVideo() {
    this.initYT();
  }

  render() {
    let content;

    if (this.isLoading) {
      content = <p>Getting content</p>;
    } else {
      content = [<h2>{this.video.title}</h2>, <img src={this.video.img} />];
    }

    return (
      <div class="card" onClick={() => this.playVideo()}>
        {content}
      </div>
    );
  }
}
