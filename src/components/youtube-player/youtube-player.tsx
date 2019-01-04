import { Component, Prop, State, Element } from '@stencil/core';

import { Video } from '../../models/video.model';
// import { EnvVar } from '../../env/env.variables';

@Component({
  tag: 'youtube-player',
  styleUrl: 'youtube-player.css',
  shadow: true
})
export class PlayerContainer {
  // Variables
  private height: number;
  private player: HTMLElement;
  private url: string = 'https://www.googleapis.com/youtube/v3/';
  private width: number;

  // Elements
  @Element() el: HTMLElement;

  // States
  @State() isLoading: boolean = true;
  @State() video: Video = {
    title: null,
    img: null
  };

  // Props
  @Prop() key: string = null;
  @Prop() id: string;
  @Prop() size: string = 'medium';

  // Lifecycle
  componentWillLoad() {
    console.log(this.key);
    if (this.key) {
      this.fetchVideoData(this.id);
    } else {
      setTimeout(() => this.fetchVideoData(this.id), 100);
    }
  }
  componentDidLoad() {
    this.createYTPlayerDiv();
  }

  // Methods
  private createYTPlayerDiv(): void {
    this.player = document.createElement('div');
    this.player.id = 'player';
    this.el.shadowRoot.querySelector('.card').appendChild(this.player);
  }
  private async fetchVideoData(videoId: string): Promise<void> {
    this.isLoading = true;

    await fetch(`${this.url}videos?part=snippet&id=${videoId}&key=${this.key}`)
      .then(res => res.json())
      .then(res => {
        this.isLoading = false;
        const vid = res.items[0].snippet;
        console.log(res);
        this.video.img = vid.thumbnails[this.size].url;
        this.height = vid.thumbnails[this.size].width;
        this.width = vid.thumbnails[this.size].height;
        this.video.title = vid.title;
      })
      .catch(e => console.log(e));
  }
  private iFramePlayer(): void {
    window['onYouTubeIframeAPIReady'] = () => {
      new window['YT'].Player(this.player, {
        videoId: this.id,
        width: this.width,
        height: this.height,
        events: {
          onError: () => console.log('Error'),
          onReady: e => {
            e.target.playVideo();
          }
        }
      });
    };
  }
  private initYT(): void {
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.onload = () => {
      this.iFramePlayer();
    };
    document.body.appendChild(script);
  }
  private playVideo(): void {
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
