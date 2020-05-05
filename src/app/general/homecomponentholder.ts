import { HomeComponent } from '../home/home.component';

export class HomeComponentHolder {
    private static instance : HomeComponentHolder;
    private homeComponent : HomeComponent;

    private constructor() { }
    public static getInstance(): HomeComponentHolder {
        if (!HomeComponentHolder.instance) {
            HomeComponentHolder.instance = new HomeComponentHolder();
        }

        return HomeComponentHolder.instance;
    }

    public getHomeComponent() : HomeComponent {
        return this.homeComponent;
    }

    public setHomeComponent(homeRef : HomeComponent) : void {
        this.homeComponent = homeRef;
    }
}