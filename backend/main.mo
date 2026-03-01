import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  type Score = {
    nickname : Text;
    score : Nat;
  };

  module Score {
    public func compareByScore(s1 : Score, s2 : Score) : Order.Order {
      Nat.compare(s2.score, s1.score);
    };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let highScores = Map.empty<Principal, Score>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func submitScore(nickname : Text, score : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can submit scores");
    };
    let newScore = { nickname; score };
    switch (highScores.get(caller)) {
      case (null) {
        highScores.add(caller, newScore);
      };
      case (?existingScore) {
        if (score > existingScore.score) {
          highScores.add(caller, newScore);
        };
      };
    };
  };

  public query ({ caller }) func getHighScore() : async ?Score {
    highScores.get(caller);
  };

  public query func getLeaderboard() : async [Score] {
    highScores.values().toArray().sort(Score.compareByScore).sliceToArray(0, 10);
  };
};
