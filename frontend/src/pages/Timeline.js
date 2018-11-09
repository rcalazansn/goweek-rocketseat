import React, { Component } from 'react';

import api from '../services/api';

import './Timeline.css';
import twitterLogo from '../twitter.svg';

import Tweet from '../components/Tweet';

import socket from 'socket.io-client';

export default class Timeline extends Component {

  state = {
    tweets: [],
    newTweet: '',
  };

  async componentDidMount() {

    this.subscribeToEvents();

    const response = await api.get('tweets');

    this.setState({ tweets: response.data });
  }

  subscribeToEvents = () => {
    const io = socket('http://localhost:3000');

    io.on('tweet', data => {
      this.setState({ tweets: [data, ...this.state.tweets] });
    });

    io.on('like', data => {
      this.setState({
        tweets: this.state.tweets.map(tweet =>
          tweet._id === data._id ? data : tweet
        )
      });
    });
  }

  handleInputChange = e => {
    this.setState({ newTweet: e.target.value });
  }

  handleNewTweet = async e => {
    if (e.keyCode !== 13) return;

    const content = this.state.newTweet;
    const autor = localStorage.getItem('@GoTwitter:usename');

    await api.post('tweets', { content, autor });
    this.setState({ newTweet: '' });
  };

  render() {
    return (
      <div className="timeline-wrapper">
        <img height={24} src={twitterLogo} />
        <form>
          <textarea
            value={this.state.newTweet}
            onChange={this.handleInputChange}
            onKeyDown={this.handleNewTweet}
            placeholder="O que está acontecendo?"
          />
        </form>

        <ul className="tweet-list">
          {this.state.tweets.map(tweet => (
            <Tweet key={tweet._id} feed={tweet} />
          ))};
        </ul>
      </div>
    );
  }
}
