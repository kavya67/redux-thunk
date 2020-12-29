import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchPostsAndUsers } from "../actions";

class UserHeader extends Component {
  // componentDidMount() {
  //   this.props.fetchPostsAndUsers(this.props.id);
  // }
  render() {
    const { user } = this.props;
    if (!user) {
      return null;
    }
    return <div className="header">{user.name}</div>;
  }
}

const mapStateToProps = (state, ownProps) => {
  //ownProps can access the props passed to component
  return {
    user: state.users.find((user) => user.id === ownProps.id),
  };
};

export default connect(mapStateToProps, { fetchPostsAndUsers })(UserHeader);
