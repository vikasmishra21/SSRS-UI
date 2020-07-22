export class Order {
    ID: number;
    OrderCode: string;
    HardCloseDate: any;
    OSCTemplateName: string;
    OrderType: number;
    PreIncentiveRuleID_Mailing: number;
    PostIncentiveRuleID_Mailing: number;
    PreIncentiveRuleID_Reminder1: number;
    PostIncentiveRuleID_Reminder1: number;
    PreIncentiveRuleID_Reminder2: number;
    PostIncentiveRuleID_Reminder2: number;
    CleaningRuleID: number;
    IsActive: number;
    SampleCount: number;
    ReceiptedCount: number;
    FinalizedCount: number;
    CreatedOn: any;
    CreatedBy: string;
    ModifiedOn: any;
    ModifiedBy: string;
    PulledCount: number;
    FactorValues: any;
    InitialIncentiveMapping: any;
    Rem1IncentiveMapping: any;
    Rem2IncentiveMapping: any

    constructor(_createdBy) {
        this.IsActive = 1;
        this.CreatedOn = new Date();
        this.ModifiedOn = new Date();
        this.CreatedBy = _createdBy;
        this.ModifiedBy = _createdBy;
        this.PulledCount = 0;
        this.ReceiptedCount = 0;
        this.FinalizedCount = 0;
    }


}

export class CleaningRule {
    ID: number;
    Name: string;
    Filename: string;
}

export class IncentiveRule {
    ID: number;
    Name: string;
    Rule: string;
    OrderType: string
}

export class Activity {
    ID: number;
    OrderCode: string;
    ActivityType: number
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn: Date;
    ModifiedBy: string;
    FileURL1: string;
    FileURL2: string;
    FilterUsed: string;
    RecordsGenerated: number;
    DownloadHistory: string;

    constructor() {
        this.CreatedOn = new Date();
        this.CreatedBy = 'Admin'
        this.ModifiedOn = new Date();
        this.ModifiedBy = 'Admin'
    }
}
export class Chart {
    id: String;
    data: Object;
    height: any;
    width: any;
    constructor(config: Object) {
        this.id = config['id'];
        this.data = config['data'];
        this.height = config['height'] || 300;
        this.width = config['width'] || '100%';
    }
}

export class User {
    UserName: string;
    Password: string;
}

export class UploadSampleValidationResult {
    Filename: string;

    ValidatingFileType: string;

    ValidatingIfactor: string;

    ValidatingIfactorCount: number;

    ValidatingRecordCount: string;

    ValidatingDuplicatePasscodes: boolean;
    ValidatingOrderID: boolean;
    ValidatingPasscode: boolean;
}

export class FinalDataExtractReport {
    OrderCode: string;
    HardCloseDate: any;
    ExpectedRecordCount: number;
    SampleCount: number;
    OrderType: number;
    ExtractRunOn: Date;
    ExtractRunBy: string;
    RecordsGenerated: string;
    TotalCompletes: number;
    TotalCompletesPaper: number;
    TotalCompletesPhone: number;
    FullCompletes: number;
    PartialCompletes: number;
    NonCompletes: number;
}

export class BarCodeInfo {
    OrderCode: string;
    Language: string;
    Password: string;
    OrderType: number;
    IFactor: string;
    PreIncentive: number;
    MailingIndicator: string;
}
export class PoReturnProblem {
    ProblemType: string;
    BarCodeInfo: BarCodeInfo;
    ExpectedMoney: number;
    ActualMoney: number;
    Notes: string;
    AssignedTo: string;
    ReportedBy: string;

    constructor() {
        this.BarCodeInfo = new BarCodeInfo();
        this.ProblemType = '';
    }
}

