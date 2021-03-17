import React from 'react';
import {Text} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import Backend from '../../backend/messagingBackend';

export default class ChatScreen extends React.Component {
    state = {
      messages: [],
    };
    
    render() {
      return (
        // <Text>
        //     {this.props.route.params.name}
        // </Text>
        <GiftedChat
            messages={this.state.messages}
            onSend={(message) => {
                // Backend.sendMessage(message);
                alert("Message being sent: " + JSON.stringify(message));
            }}
            user={{
                // _id: Backend.getUid(),
                name: this.props.route.params.name,
            }}
        />
      );
    }

    componentDidMount() {
        console.log("Props \n" + JSON.stringify(this.props));
    //   Backend.loadMessages((message) => {
    //     this.setState((previousState) => {
    //       return {
    //         messages: GiftedChat.append(previousState.messages, message),
    //       };
    //     });
    //   });
    }
    componentWillUnmount() {
    //   Backend.closeChat();
    }
}
  
// ChatScreen.defaultProps = {
//     name: 'Mike',
// };

// ChatScreen.propTypes = {
//     name: React.PropTypes.string,
// };
