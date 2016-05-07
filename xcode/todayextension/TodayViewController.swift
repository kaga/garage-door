//
//  TodayViewController.swift
//  todayextension
//
//  Created by Kwun Ho Chan on 7/05/16.
//  Copyright © 2016 kaga. All rights reserved.
//

import UIKit
import NotificationCenter
import GarageDoorKit

class TodayViewController: UIViewController, NCWidgetProviding {
    
    var urlSession: NSURLSession {
        return NSURLSession.sharedSession();
    };
    
    @IBOutlet weak var toggleButton: UIButton!;
    
    override func viewDidLoad() {
        super.viewDidLoad();
        
        self.toggleButton.layer.cornerRadius = 5;
        self.toggleButton.clipsToBounds = true;
        
        let height = CGRectGetHeight(self.toggleButton.frame) + 10*2;        
        self.preferredContentSize = CGSizeMake(0, height);
        // Do any additional setup after loading the view from its nib.
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func widgetPerformUpdateWithCompletionHandler(completionHandler: ((NCUpdateResult) -> Void)) {
        // Perform any setup necessary in order to update the view.

        // If an error is encountered, use NCUpdateResult.Failed
        // If there's no update required, use NCUpdateResult.NoData
        // If there's an update, use NCUpdateResult.NewData

        completionHandler(NCUpdateResult.NewData);
    }
    
    func widgetMarginInsetsForProposedMarginInsets(defaultMarginInsets: UIEdgeInsets) -> UIEdgeInsets {
        return UIEdgeInsetsZero;
    }
    
    @IBAction func toggleGarageDoor(sender: AnyObject) {
        urlSession.toggleGarageDoor();
    }
}
