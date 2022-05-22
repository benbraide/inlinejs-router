"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterFetcher = void 0;
class RouterFetcher {
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
exports.RouterFetcher = RouterFetcher;
