export class RouterFetcher {
    constructor(path_, handler_) {
        this.path_ = path_;
        this.handler_ = handler_;
    }
    GetPath() {
        return this.path_;
    }
    Handle(params) {
        return this.handler_(params);
    }
}
