//
//  GarageDoorKitTests.swift
//  GarageDoorKitTests
//
//  Created by Kwun Ho Chan on 7/05/16.
//  Copyright © 2016 kaga. All rights reserved.
//

import XCTest
@testable import GarageDoorKit

class GarageDoorKitTests: XCTestCase {
    
    override func setUp() {
        super.setUp()
        // Put setup code here. This method is called before the invocation of each test method in the class.
    }
    
    override func tearDown() {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
        super.tearDown()
    }
    
    func testExample() {
        // This is an example of a functional test case.
        // Use XCTAssert and related functions to verify your tests produce the correct results.
        let urlSession = NSURLSession();
        let url = urlSession.toggleGarageUrl;
        XCTAssertEqual(url.absoluteString, "http://raspberrypi.local:3000/v1/garage/toggle")
    }
    
}
