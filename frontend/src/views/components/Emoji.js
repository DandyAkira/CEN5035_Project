import React from 'react';
import {PropTypes} from "prop-types";
import "./Emoji.css"

class Emoji extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.handleEmojiClick = this.handleEmojiClick.bind(this)
    }

    handleEmojiClick(emoji) {
        this.props.handleEmojiClick(emoji)
    }

    render() {
        const emojis = ["😊", "😃", "😏", "😍", "😘", "😚", "😳", "😌", "😆", "😁", "😉", "😜", "😝", "😀", "😗", "😙", "😛", "😴", "😟", "😦", "😧", "😮", "😬", "😕", "😯", "😑", "😒", "😅", "😓", "😥", "😩", "😔", "😞", "😖", "😨", "😰", "😣", "😢", "😭", "😂", "😲", "😱", "😫", "😠", "😤", "😪", "😋", "😷", "😎", "😵", "👿", "😈", "😐", "😶", "👍", "👍", "👎", "👎", "👌", "👊", "👊", "✊", "✌", "👋", "✋", "✋", "👐", "☝", "👇", "👈", "👉", "🙌", "🙏", "👆", "👏", "💪", "🤘"]
        const items = emojis.map((value, index) => <li key={index} onClick={this.handleEmojiClick.bind(this, value)}
                                                       className={"chat-room-emoji-list-item"}>{value}</li>)
        return <>
            <div className="chat-room-emoji-list">
                {items}
            </div>
        </>
    }


}

Emoji.propTyps = {
    handleEmojiClick: PropTypes.func.isRequired
}

export default Emoji