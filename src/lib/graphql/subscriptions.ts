export const ROOM_CREATED_SUBSCRIPTION = `
  subscription RoomCreated {
    roomCreated {
      room {
        id
        name
        createdAt
        master {
          id
          username
          email
        }
        guest {
          id
          username
          email
        }
      }
    }
  }
`;

export const ROOM_UPDATED_SUBSCRIPTION = `
  subscription RoomUpdated {
    roomUpdated {
      room {
        id
        name
        createdAt
        master {
          id
          username
          email
        }
        guest {
          id
          username
          email
        }
      }
    }
  }
`;

export const ROOM_DELETED_SUBSCRIPTION = `
  subscription RoomDeleted {
    roomDeleted {
      id
    }
  }
`;
