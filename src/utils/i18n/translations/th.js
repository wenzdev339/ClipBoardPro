export const th = {
  app: {
    title: 'ClipBoard Pro',
    version: 'เวอร์ชัน',
    madeBy: 'สร้างด้วย',
    by: 'โดย'
  },

  header: {
    items: 'รายการ',
    searchPlaceholder: 'ค้นหาคลิปบอร์ด',
    filter: 'กรอง',
    viewMode: 'มุมมอง',
    clearAll: 'ล้างทั้งหมด',
    settings: 'ตั้งค่า'
  },

  filter: {
    all: 'ทั้งหมด',
    text: 'ข้อความ',
    images: 'รูปภาพ',
    code: 'โค้ด'
  },

  item: {
    text: 'ข้อความ',
    image: 'รูปภาพ',
    code: 'โค้ด',
    copy: 'คัดลอก',
    copied: 'คัดลอกแล้ว',
    edit: 'แก้ไข',
    delete: 'ลบ',
    justNow: 'เมื่อสักครู่',
    minutesAgo: '{{count}} นาทีที่แล้ว',
    hoursAgo: '{{count}} ชั่วโมงที่แล้ว',
    daysAgo: '{{count}} วันที่แล้ว'
  },

  empty: {
    title: 'ไม่มีประวัติคลิปบอร์ด',
    titleSearch: 'ไม่พบผลลัพธ์',
    description: 'คัดลอกข้อความหรือรูปภาพ',
    descriptionSearch: 'ไม่พบรายการที่ตรงกับ "{{query}}" ลองคำค้นหาอื่น'
  },

  edit: {
    title: 'แก้ไขเนื้อหา',
    save: 'บันทึกการเปลี่ยนแปลง',
    cancel: 'ยกเลิก',
    shortcuts: {
      save: 'เพื่อบันทึก',
      cancel: 'เพื่อยกเลิก'
    }
  },

  settings: {
    title: 'ตั้งค่า',
    save: 'บันทึกการเปลี่ยนแปลง',
    cancel: 'ยกเลิก',
    
    sections: {
      application: 'แอปพลิเคชัน',
      appearance: 'หน้าตา',
      language: 'ภาษา',
      storage: 'พื้นที่จัดเก็บ',
      privacy: 'ความเป็นส่วนตัว',
      shortcuts: 'ทางลัด'
    },

    application: {
      closeBehavior: 'พฤติกรรมปุ่มปิด',
      minimizeToTray: 'ย่อลงถาดระบบ',
      closeApplication: 'ปิดแอปพลิเคชัน',
      startWhenTurnsOn: 'เริ่มเมื่อเปิดคอมพิวเตอร์',
      startMinimized: 'เริ่มแบบย่อในถาดระบบ',
      showTrayNotifications: 'แสดงการแจ้งเตือนในถาดระบบ',
      updating: 'กำลังอัปเดต...'
    },

    appearance: {
      theme: 'ธีม',
      themes: {
        dark: 'มืด',
        light: 'สว่าง',
        auto: 'อัตโนมัติ (ระบบ)'
      },
      builtInThemes: 'ธีมในตัว',
      defaultView: 'มุมมองเริ่มต้น',
      gridView: 'มุมมองตาราง',
      listView: 'มุมมองรายการ',
      themeBuilder: 'สร้างธีม',
      customizeIcons: 'ปรับแต่งไอคอน'
    },

    language: {
      interfaceLanguage: 'ภาษาอินเทอร์เฟซ'
    },

    storage: {
      maximumItems: 'จำนวนรายการสูงสุด',
      autoDelete: 'ลบอัตโนมัติ',
      items: '{{count}} รายการ',
      never: 'ไม่เลย',
      after5min: 'หลัง 5 นาที',
      after15min: 'หลัง 15 นาที',
      after30min: 'หลัง 30 นาที',
      after1hour: 'หลัง 1 ชั่วโมง',
      after2hours: 'หลัง 2 ชั่วโมง',
      after6hours: 'หลัง 6 ชั่วโมง',
      after12hours: 'หลัง 12 ชั่วโมง',
      after1day: 'หลัง 1 วัน',
      after3days: 'หลัง 3 วัน',
      after7days: 'หลัง 7 วัน',
      after30days: 'หลัง 30 วัน'
    },

    privacy: {
      monitorClipboard: 'ตรวจสอบคลิปบอร์ดอัตโนมัติ',
      saveOnClose: 'บันทึกคลิปบอร์ดเมื่อปิดแอป',
      excludeSensitive: 'ไม่รวมข้อมูลที่ละเอียดอ่อน'
    },

    shortcuts: {
      quickAccess: 'เข้าถึงด่วน',
      clearAll: 'ล้างทั้งหมด',
      pressKeys: 'กดปุ่ม...',
      cancel: 'ยกเลิก',
      recording: 'กำลังบันทึก...'
    },

    danger: {
      clearAllData: 'ล้างข้อมูลทั้งหมด',
      resetSettings: 'รีเซ็ตการตั้งค่า',
      confirmClear: 'คลิกอีกครั้งเพื่อยืนยัน',
      confirmReset: 'คลิกอีกครั้งเพื่อยืนยัน'
    }
  },

  tray: {
    show: 'แสดงหน้าต่าง',
    hide: 'ซ่อนหน้าต่าง',
    quit: 'ออก'
  },

  footer: {
    donate: 'บริจาค',
    support: 'สนับสนุนนักพัฒนา'
  },

  notifications: {
    itemCopied: 'คัดลอกรายการไปยังคลิปบอร์ดแล้ว',
    itemDeleted: 'ลบรายการแล้ว',
    historyCleared: 'ล้างประวัติแล้ว',
    settingsSaved: 'บันทึกการตั้งค่าแล้ว',
    settingsReset: 'รีเซ็ตการตั้งค่าเป็นค่าเริ่มต้นแล้ว'
  },

  errors: {
    copyFailed: 'ไม่สามารถคัดลอกไปยังคลิปบอร์ด',
    loadFailed: 'ไม่สามารถโหลดข้อมูล',
    saveFailed: 'ไม่สามารถบันทึกการตั้งค่า'
  },

  viewMode: {
    grid: 'ตาราง',
    list: 'รายการ'
  }
};