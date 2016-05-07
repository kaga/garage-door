//
//  NSURLSession+GarageDoorKit.swift
//  garagedoor
//
//  Created by Kwun Ho Chan on 7/05/16.
//  Copyright © 2016 kaga. All rights reserved.
//

import Foundation

public extension NSURLSession {
    var toggleGarageUrl: NSURL {
        let components = NSURLComponents();
        components.scheme = "http";
        components.host = "raspberrypi.local";
        components.port = 3000;
        components.path = "/v1/garage/toggle";
        return components.URL!;
    }
    
    
    public func toggleGarageDoor() {
        let url = self.toggleGarageUrl;
        let request = NSMutableURLRequest(URL: url);
        request.HTTPMethod = "GET";
        request.allowsCellularAccess = false;
        let task = self.dataTaskWithRequest(request) { (data, response, error) in
            
        }
        task.resume();
    }
}