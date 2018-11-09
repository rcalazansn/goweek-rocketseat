import React, { Component } from 'react';

import './Tweet.css';
import like from '../like.svg';

import api from '../services/api';

export default class Tweet extends Component {

    handleLike = async () => {
        const { _id } = this.props.feed;

        await api.post(`likes/${_id}`);
    }

    render() {

        const { feed } = this.props;

        return (
            <li className="tweet">
                <strong>{feed.autor}</strong>
                <p>{feed.content}</p>
                <button type="button" onClick={this.handleLike}>
                    <img src={like} alt="likes" />
                    {feed.likes}
                </button>
            </li>
        );
    }
}
