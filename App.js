import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import AppSyncConfig from "./AppSync";
import { AWSAppSyncClient } from "aws-appsync";
import gql from "graphql-tag";

const client = new AWSAppSyncClient({
  url: AppSyncConfig.graphqlEndpoint,
  region: AppSyncConfig.region,
  auth: {
    type: AppSyncConfig.authType,
    apiKey: AppSyncConfig.apiKey,
  },
  disableOffline: true
});

console.log(global.WebSocket);
console.log(global.ArrayBuffer);
console.log(global.localStorage);

export default class App extends React.Component {

  subscription;
  state = { lastMessage: null };

  toggleSubscription = () => {
    console.log(this.subscription && this.subscription.closed);
    if (!this.subscription || this.subscription.closed) {
      this.subscription = client.subscribe({
        query: gql`subscription S($eventId: String!) {
      subscribeToEventComments(
        eventId: $eventId
      ) {
        eventId
        commentId
        content
        createdAt
      }
    }`,
        variables: { eventId: "45a8bc47-6f42-43bf-9b88-ac921c008a77" }
      }).subscribe({
        next: data => (console.log(data), this.setState({ lastMessage: data }))
      });
    } else {
      this.subscription.unsubscribe();
    }

    this.setState({ lastMessage: null });
  }

  render() {
    const { lastMessage } = this.state;

    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
        <Button
          title={!this.subscription || this.subscription.closed ? 'Subscribe' : 'Unsubscribe'}
          onPress={this.toggleSubscription} />
        <Text>{lastMessage && JSON.stringify(lastMessage, null, 2)}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
