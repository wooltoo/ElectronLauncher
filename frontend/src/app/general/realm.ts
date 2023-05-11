import { RealmStatus } from "./realmstatus";

export class Realm
{
    name : string;
    status : RealmStatus;
    realmList : string;

    constructor(name : string, status : RealmStatus,  realmList : string) {
        this.name = name;
        this.status = status;
        this.realmList = realmList;
    }

    getName() : string {
        return this.name;
    }

    getStatus() : RealmStatus {
        return this.status;
    }

    getRealmList() : string {
        return this.realmList;
    }
}