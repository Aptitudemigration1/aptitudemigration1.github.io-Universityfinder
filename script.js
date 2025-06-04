// Add Gmail API configuration at the top
const GMAIL_CONFIG = {
  apiKey: 'AIzaSyDBAfal0TyznYnZOPOEjuvjeXiKXLaHOTk',
  clientId: '907370875987-2qc7665tvdqk69c1u3qm1b0vc5i3c7pv.apps.googleusercontent.com',
  scopes: 'https://www.googleapis.com/auth/gmail.send',
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest']
};

// Load the Gmail API client
function loadGmailApi() {
  return new Promise((resolve, reject) => {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        apiKey: GMAIL_CONFIG.apiKey,
        clientId: GMAIL_CONFIG.clientId,
        discoveryDocs: GMAIL_CONFIG.discoveryDocs,
        scope: GMAIL_CONFIG.scopes
      }).then(() => {
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  });
}

// Function to send email using Gmail API
async function sendGmailWithAttachment(emailData) {
  try {
    // Check if user is signed in
    if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
      await gapi.auth2.getAuthInstance().signIn();
    }

    const attachments = await Promise.all(
      Array.from(document.getElementById('attachmentInput').files)
        .map(file => readFileAsBase64(file))
    );

    const email = createEmailWithAttachments(emailData, attachments);

    await gapi.client.gmail.users.messages.send({
      userId: 'me',
      resource: {
        raw: createRawEmail(email)
      }
    });

    alert('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    alert('Failed to send email. Please try again.');
  }
}

// Helper function to read file as base64
function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve({
        filename: file.name,
        mimeType: file.type,
        content: base64
      });
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// Create email with attachments
function createEmailWithAttachments(emailData, attachments) {
  const boundary = 'boundary' + Math.random().toString(36);
  const mimeVersion = 'MIME-Version: 1.0\n';
  const contentType = 'Content-Type: multipart/mixed; boundary=' + boundary + '\n';

  let email = [
    'To: ' + emailData.to,
    'From: ' + emailData.from,
    'Subject: ' + emailData.subject,
    mimeVersion,
    contentType,
    '',
    '--' + boundary,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    emailData.body,
    ''
  ];

  // Add attachments
  attachments.forEach(attachment => {
    email = email.concat([
      '--' + boundary,
      'Content-Type: ' + (attachment.mimeType || 'application/octet-stream'),
      'Content-Transfer-Encoding: base64',
      'Content-Disposition: attachment; filename=' + attachment.filename,
      '',
      attachment.content
    ]);
  });

  email.push('--' + boundary + '--');
  return email.join('\n');
}

// Convert email to base64url format
function createRawEmail(emailContent) {
  return btoa(emailContent)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Update the openEmailClient function
function openEmailClient(client, emailData) {
  const subject = encodeURIComponent(emailData.subject);
  const body = encodeURIComponent(emailData.body);

  switch (client) {
    case 'gmail':
      // Check if there are attachments
      if (emailData.attachments && emailData.attachments.length > 0) {
        // Load Gmail API and send with attachments
        loadGmailApi()
          .then(() => sendGmailWithAttachment(emailData))
          .catch(error => {
            console.error('Error loading Gmail API:', error);
            alert('Failed to load Gmail API. Please try again.');
          });
      } else {
        // No attachments, use simple Gmail compose URL
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${emailData.to}&su=${subject}&body=${body}`, '_blank');
      }
      break;
    case 'outlook':
      window.location.href = `mailto:${emailData.to}?subject=${subject}&body=${body}`;
      break;
    default:
      window.location.href = `mailto:${emailData.to}?subject=${subject}&body=${body}`;
      break;
  }
}

document.documentElement.style.setProperty('--animate-duration', '0.5s');

// Country-specific configurations
const countryConfigs = {
  Australia: {
    states: {
      'New South Wales': ['Sydney', 'Newcastle', 'Wollongong', 'Central Coast', 'Albury', 'Armidale', 'Bathurst', 'Coffs Harbour', 'Dubbo', 'Goulburn', 'Grafton', 'Griffith', 'Lismore', 'Orange', 'Port Macquarie', 'Queanbeyan', 'Tamworth', 'Tweed Heads', 'Wagga Wagga', 'Aarons Pass', 'Abbotsbury', 'Abbotsford', 'Abercrombie', 'Abercrombie River', 'Aberdare', 'Aberdeen', 'Aberfoyle', 'Aberglasslyn', 'Abermain', 'Abernethy', 'Abington', 'Acacia Creek', 'Acacia Gardens', 'Adaminaby', 'Adamstown', 'Adamstown Heights', 'Adelong', 'Adjungbilly', 'Afterlee', 'Agnes Banks', 'Airds', 'Akolele', 'Albert', 'Albion Park', 'Albion Park Rail', 'Aldavilla', 'Alectown', 'Alexandria', 'Alfords Point', 'Alfredtown', 'Alice', 'Alison', 'Allambie Heights', 'Allandale', 'Allawah', 'Alleena', 'Allgomera', 'Allworth', 'Allynbrook', 'Alma Park', 'Alpine', 'Alstonvale', 'Alstonville', 'Alumy Creek', 'Amaroo', 'Ambarvale', 'Amosfield', 'Anabranch North', 'Anabranch South', 'Anambah', 'Ando', 'Anembo', 'Angledale', 'Angledool', 'Anglers Reach', 'Angourie', 'Anna Bay', 'Annandale', 'Annangrove', 'Appin', 'Apple Tree Flat', 'Appleby', 'Appletree Flat', 'Apsley', 'Arable', 'Arakoon', 'Araluen', 'Aratula', 'Arcadia', 'Arcadia Vale', 'Ardglen', 'Arding', 'Ardlethan', 'Argalong', 'Argenton', 'Argents Hill', 'Argoon', 'Ariah Park', 'Arkell', 'Arkstone', 'Armatree', 'Arncliffe', 'Arndell Park', 'Arrawarra', 'Arrawarra Headland', 'Artarmon', 'Arthurville', 'Arumpo', 'Ashbury', 'Ashby', 'Ashby Heights', 'Ashby Island', 'Ashcroft', 'Ashfield', 'Ashford', 'Ashley', 'Ashmont', 'Ashtonfield', 'Asquith', 'Atholwood', 'Attunga', 'Auburn', 'Auburn Vale', 'Austinmer', 'Austral', 'Austral Eden', 'Avalon Beach', 'Avisford', 'Avoca', 'Avoca Beach', 'Avon', 'Avondale', 'Avonside', 'Awaba', 'Aylmerton', 'Baan Baa', 'Babinda', 'Babyl Creek', 'Back Creek', 'Back Forest', 'Backmede', 'Backwater', 'Badgerys Creek', 'Badja', 'Baerami', 'Baerami Creek', 'Bagnoo', 'Bago', 'Bagotville', 'Bakers Creek', 'Bakers Swamp', 'Balaclava', 'Balala', 'Balcolyn', 'Bald Blair', 'Bald Hills', 'Bald Nob', 'Bald Ridge', 'Baldersleigh', 'Baldry', 'Balfours Peak', 'Balgowlah', 'Balgowlah Heights', 'Balgownie', 'Balickera', 'Balladoran', 'Ballalaba', 'Balldale', 'Ballengarra', 'Ballimore', 'Ballina', 'Ballyroe', 'Balmain', 'Balmain East', 'Balmoral', 'Balranald', 'Bamarang', 'Banda Banda', 'Bandon Grove', 'Bangadang', 'Bangalee', 'Bangalow', 'Bangheet', 'Bango', 'Bangor', 'Banksia', 'Banksmeadow', 'Bankstown', 'Bankstown Aerodrome', 'Bannaby', 'Bannister', 'Banoon', 'Banora Point', 'Banyabba', 'Bar Beach', 'Bar Point', 'Bara', 'Baradine', 'Barangaroo', 'Barcoongere', 'Barden Ridge', 'Bardia', 'Bardwell Park', 'Bardwell Valley', 'Barellan', 'Bargo', 'Barham', 'Barigan', 'Barkers Vale', 'Barmedman', 'Barneys Reef', 'Barnsley', 'Barooga', 'Barraba', 'Barrack Heights', 'Barrack Point', 'Barraganyatti', 'Barragga Bay', 'Barratta', 'Barren Grounds', 'Barrengarry', 'Barretts Creek', 'Barringella', 'Barrington', 'Barrington Tops', 'Barry', 'Barwang', 'Barwon', 'Baryulgil', 'Basin View', 'Bass Hill', 'Bassendean', 'Batar Creek', 'Bateau Bay', 'Batehaven', 'Batemans Bay', 'Bathampton', 'Batlow', 'Baulkham Hills', 'Baw Baw', 'Bawley Point', 'Baxters Ridge', 'Bayview', 'Beacon Hill', 'Beaconsfield', 'Bean Creek', 'Bearbong', 'Beaumont', 'Beaumont Hills', 'Beckom', 'Bective', 'Bectric', 'Bedgerabong', 'Beechwood', 'Beecroft', 'Beecroft Peninsula', 'Beelbangera', 'Beemunnel', 'Bega', 'Beggan Beggan', 'Belanglo', 'Belbora', 'Belfield', 'Belford', 'Belfrayden', 'Belgravia', 'Belimbla Park', 'Bell', 'Bella Vista', 'Bellambi', 'Bellangry', 'Bellata', 'Bellawongarah', 'Bellbird', 'Bellbird Heights', 'Bellbrook', 'Bellevue Hill', 'Bellimbopinni', 'Bellingen', 'Bellmount Forest', 'Belltrees', 'Belmont', 'Belmont North', 'Belmont South', 'Belmore', 'Belmore River', 'Beloka', 'Belowra', 'Belrose', 'Bemboka', 'Ben Bullen', 'Ben Lomond', 'Benandarah', 'Bendalong', 'Bendemeer', 'Bendick Murrell', 'Bendolba', 'Bendoura', 'Benerembah', 'Bengalla', 'Bennetts Green', 'Benolong', 'Bensville', 'Bentley', 'Berala', 'Berambing', 'Beresfield', 'Bergalia', 'Berkeley', 'Berkeley Vale', 'Berkshire Park', 'Berlang', 'Bermagui', 'Berowra', 'Berowra Creek', 'Berowra Heights', 'Berowra Waters', 'Berrambool', 'Berrara', 'Berremangra', 'Berrico', 'Berridale', 'Berrigal', 'Berrigan', 'Berrilee', 'Berrima', 'Berringer Lake', 'Berry', 'Berry Jerry', 'Berry Mountain', 'Berry Park', 'Berthong', 'Beryl', 'Bethungra', 'Bevendale', 'Beverley Park', 'Beverly Hills', 'Bewong', 'Bexhill', 'Bexley', 'Bexley North', 'Biala', 'Bibbenluke', 'Biddon', 'Bidgeemia', 'Bidwill', 'Bielsdown Hills', 'Big Hill', 'Big Jacks Creek', 'Big Ridge', 'Big Springs', 'Bigga', 'Bilambil', 'Bilambil Heights', 'Bilbul', 'Bilgola Beach', 'Bilgola Plateau', 'Billeroy', 'Billilingra', 'Billimari', 'Billinudgel', 'Billys Creek', 'Billywillinga', 'Bilpin', 'Bimberi', 'Bimbi', 'Bimbimbie', 'Binalong', 'Binda', 'Bindera', 'Bingara', 'Bingeebeebra Creek', 'Bingie', 'Bingleburra', 'Biniguy', 'Binjura', 'Binna Burra', 'Binnaway', 'Binya', 'Birchgrove', 'Birdwood', 'Birganbigil', 'Birmingham Gardens', 'Birriwa', 'Birrong', 'Bishops Bridge', 'Bithramere', 'Black Creek', 'Black Head', 'Black Hill', 'Black Hollow', 'Black Mountain', 'Black Range', 'Black Springs', 'Blackalls Park', 'Blackbutt', 'Blackett', 'Blackheath', 'Blackmans Flat', 'Blackmans Point', 'Blacksmiths', 'Blacktown', 'Blackville', 'Blackwall', 'Blair Athol', 'Blairmount', 'Blakebrook', 'Blakehurst', 'Blakney Creek', 'Bland', 'Blandford', 'Blaxland', 'Blaxlands Creek', 'Blaxlands Ridge', 'Blayney', 'Bligh Park', 'Blighty', 'Blowering', 'Blue Bay', 'Blue Haven', 'Blue Knob', 'Blue Mountains National Park', 'Blue Nobby', 'Blue Vale', 'Blueys Beach', 'Boambee', 'Boambee East', 'Boambolo', 'Boat Harbour', 'Bobadah', 'Bobin', 'Bobs Creek', 'Bobs Farm', 'Bobundara', 'Boco', 'Bocoble', 'Bocobra', 'Bodalla', 'Bodangora', 'Boeill Creek', 'Bogan', 'Bogan Gate', 'Bogangar', 'Bogee', 'Boggabilla', 'Boggabri', 'Bogong Peaks Wilderness', 'Bohena Creek', 'Bohnock', 'Bolaro', 'Bolivia', 'Bolong', 'Bolton Point', 'Bolwarra', 'Bolwarra Heights', 'Bom Bom', 'Bomaderry', 'Bombah Point', 'Bombala', 'Bombay', 'Bombira', 'Bombo', 'Bombowlee', 'Bombowlee Creek', 'Bomen', 'Bomera', 'Bonalbo', 'Bondi', 'Bondi Beach', 'Bondi Forest', 'Bondi Junction', 'Bonnells Bay', 'Bonnet Bay', 'Bonny Hills', 'Bonnyrigg', 'Bonnyrigg Heights', 'Bonshaw', 'Bonville', 'Booerie Creek', 'Book Book', 'Booker Bay', 'Bookham', 'Bookookoorara', 'Bookram', 'Boolambayte', 'Boolaroo', 'Boolcarroll', 'Booligal', 'Boolijah', 'Boomanoomana', 'Boomerang Beach', 'Boomey', 'Boomi', 'Boomi Creek', 'Boona Mount', 'Boonal', 'Boonoo Boonoo', 'Boorabee Park', 'Booragul', 'Booral', 'Boorga', 'Boorganna', 'Boorolong', 'Boorook', 'Boorooma', 'Booroorban', 'Boorowa', 'Bootawa', 'Booti Booti', 'Booyong', 'Bora Ridge', 'Borah Creek', 'Borambola', 'Border Ranges', 'Boree', 'Boree Creek', 'Borenore', 'Boro', 'Bossley Park', 'Bostobrick', 'Botany', 'Botobolar', 'Bottle Creek', 'Bouddi', 'Bourbah', 'Bourke', 'Bourkelands', 'Bournda', 'Bournewood', 'Bow Bowing', 'Bowan Park', 'Bowen Mountain', 'Bowenfels', 'Bowling Alley Point', 'Bowman', 'Bowman Farm', 'Bowmans Creek', 'Bowna', 'Bowning', 'Bowral', 'Bowraville', 'Box Head', 'Box Hill', 'Box Ridge', 'Boxers Creek', 'Boydtown', 'Bradbury', 'Braefield', 'Braemar', 'Braemar Bay', 'Braidwood', 'Brandy Hill', 'Branxton', 'Braunstone', 'Brawboy', 'Bray Park', 'Brays Creek', 'Brayton', 'Breadalbane', 'Breakfast Creek', 'Breakfast Point', 'Bream Beach', 'Bredbo', 'Breelong', 'Breeza', 'Bretti', 'Brewarrina', 'Brewongle', 'Briarbrook', 'Bribbaree', 'Bridgman', 'Brierfield', 'Brighton-le-Sands', 'Brightwaters', 'Bril Bril', 'Brimbin', 'Brindabella', 'Brinerville', 'Bringelly', 'Bringenbrong', 'Brisbane Grove', 'Broadmeadow', 'Broadwater', 'Broadway', 'Brobenah', 'Brocklehurst', 'Brocklesby', 'Brockley', 'Brodies Plains', 'Brogans Creek', 'Brogers Creek', 'Brogo', 'Broke', 'Broken Head', 'Broken Hill', 'Brombin', 'Bronte', 'Brookdale', 'Brookfield', 'Brooklana', 'Brooklet', 'Brooklyn', 'Brookong', 'Brookvale', 'Brooman', 'Brooms Head', 'Broughams Gate', 'Broughton', 'Broughton Vale', 'Broughton Village', 'Broulee', 'Brownlow Hill', 'Browns Creek', 'Browns Mountain', 'Brownsville', 'Brucedale', 'Bruie Plains', 'Bruinbun', 'Brumby Plains', 'Brundee', 'Brungle', 'Brungle Creek', 'Brunkerville', 'Brunswick Heads', 'Brushgrove', 'Brushy Creek', 'Buangla', 'Bucca', 'Bucca Wauka', 'Buccarumbi', 'Buchanan', 'Buckajo', 'Buckaroo', 'Buckenbowra', 'Buckenderra', 'Buckendoon', 'Bucketty', 'Buckra Bendinni', 'Budawang', 'Buddabadah', 'Budden', 'Budderoo', 'Buddong', 'Budgee Budgee', 'Budgewoi', 'Budgewoi Peninsula', 'Budgong', 'Buff Point', 'Bugaldie', 'Bukalong', 'Bukkulla', 'Bulahdelah', 'Bulee', 'Bulga', 'Bulga Forest', 'Bulgary', 'Bulla', 'Bulla Creek', 'Bullaburra', 'Bullagreen', 'Bullarah', 'Bullatale', 'Bullawa Creek', 'Bulldog', 'Bulli', 'Bulliac', 'Bullio', 'Bulyeroi', 'Bumbaldry', 'Bumbalong', 'Bundabah', 'Bundagen', 'Bundanoon', 'Bundarra', 'Bundeena', 'Bundella', 'Bundemar', 'Bundewallah', 'Bundook', 'Bundure', 'Bungaba', 'Bungabbee', 'Bungalora', 'Bungarby', 'Bungarribee', 'Bungawalbin', 'Bungendore', 'Bungonia', 'Bungowannah', 'Bungwahl', 'Bunnaloo', 'Bunnan', 'Bunyah', 'Bunyan', 'Burcher', 'Bureen', 'Burnt Bridge', 'Burnt Yards', 'Buronga', 'Burra', 'Burra Creek', 'Burraboi', 'Burradoo', 'Burragate', 'Burrandana', 'Burraneer', 'Burrangong', 'Burrapine', 'Burrawang', 'Burrell Creek', 'Burren Junction', 'Burrier', 'Burrill Lake', 'Burringbar', 'Burrinjuck', 'Burroway', 'Burrumbuttock', 'Burrundulla', 'Burwood', 'Burwood Heights', 'Busby', 'Busbys Flat', 'Bushells Ridge', 'Buttaba', 'Buttai', 'Butterwick', 'Buxton', 'Byabarra', 'Byadbo Wilderness', 'Byangum', 'Bylong', 'Byng', 'Byrock', 'Byron Bay', 'Byrrill Creek', 'Bywong', 'Cabarita', 'Cabarita Beach', 'Cabbage Tree Island', 'Cabramatta', 'Cabramatta West', 'Cabramurra', 'Caddens', 'Cadgee', 'Cadia', 'Caffreys Flat', 'Cairncross', 'Calala', 'Calamia', 'Calderwood', 'Caldwell', 'Calga', 'Califat', 'Calimo', 'Callaghan', 'Callaghans Creek', 'Callala Bay', 'Callala Beach', 'Calliope', 'Caloola', 'Cambalong', 'Camberwell', 'Cambewarra', 'Cambewarra Village', 'Camboon', 'Cambra', 'Cambridge Gardens', 'Cambridge Park', 'Cambridge Plateau', 'Camden', 'Camden Head', 'Camden Park', 'Camden South', 'Camellia', 'Cameron Park', 'Camerons Creek', 'Camira', 'Cammeray', 'Camp Creek', 'Campbelltown', 'Camperdown', 'Campsie', 'Campvale', 'Cams Wharf', 'Canada Bay', 'Canadian Lead', 'Canbelego', 'Candelo', 'Cangai', 'Caniaba', 'Canley Heights', 'Canley Vale', 'Canobolas', 'Canelands', 'Canonba', 'Canowindra', 'Canterbury', 'Canton Beach', 'Canyonleigh', 'Caparra', 'Capeen Creek', 'Capertee', 'Capoompeta', 'Captains Flat', 'Carabost', 'Caragabal', 'Carcalgong', 'Carcoar', 'Cardiff', 'Cardiff Heights', 'Cardiff South', 'Carey Bay', 'Cargo', 'Carinda', 'Caringbah', 'Caringbah South', 'Carlaminda', 'Carlingford', 'Carlton', 'Carnes Hill', 'Carnham', 'Carool', 'Caroona', 'Carrabolla', 'Carrai', 'Carramar', 'Carrathool', 'Carrick', 'Carrington', 'Carrington Falls', 'Carroll', 'Carrowbrook', 'Carrs Creek', 'Carrs Island', 'Carrs Peninsula', 'Carss Park', 'Cartwright', 'Cartwrights Hill', 'Carwell', 'Carwoola', 'Cascade', 'Casino', 'Cassilis', 'Castle Cove', 'Castle Doyle', 'Castle Hill', 'Castle Rock', 'Castlecrag', 'Castlereagh', 'Casuarina', 'Casula', 'Catalina', 'Cataract', 'Cathcart', 'Catherine Field', 'Catherine Hill Bay', 'Cathundral', 'Cattai', 'Cattle Creek', 'Cavan', 'Caves Beach', 'Cawdor', 'Cawongla', 'Cecil Hills', 'Cecil Park', 'Cedar Brush Creek', 'Cedar Creek', 'Cedar Party', 'Cedar Point', 'Cells River', 'Centennial Park', 'Central Colo', 'Central Macdonald', 'Central Mangrove', 'Central Tilba', 'Cessnock', 'Chaelundi', 'Chain Valley Bay', 'Chakola', 'Chambigne', 'Charbon', 'Charles Sturt University', 'Charlestown', 'Charleys Forest', 'Charlotte Bay', 'Charlton', 'Charmhaven', 'Chatham Valley', 'Chatsbury', 'Chatswood', 'Chatswood West', 'Chatsworth', 'Cheero Point', 'Cheltenham', 'Cherry Tree Hill', 'Cherrybrook', 'Chester Hill', 'Chichester', 'Chifley', 'Chilcotts Creek', 'Chilcotts Grass', 'Chillingham', 'Chinderah', 'Chinnock', 'Chippendale', 'Chipping Norton', 'Chisholm', 'Chiswick', 'Chittaway Bay', 'Chittaway Point', 'Chowan Creek', 'Chullora', 'Church Point', 'Clandulla', 'Clare', 'Claremont Meadows', 'Clarence', 'Clarence Town', 'Clarendon', 'Clarenza', 'Clareville', 'Claymore', 'Clear Creek', 'Clear Range', 'Clearfield', 'Clemton Park', 'Clergate', 'Cleveland', 'Clifden', 'Cliftleigh', 'Clifton', 'Clifton Grove', 'Clontarf', 'Clothiers Creek', 'Clouds Creek', 'Clovelly', 'Clunes', 'Clybucca', 'Clyde', 'Clydesdale', 'Coal Point', 'Coalcliff', 'Coaldale', 'Coasters Retreat', 'Cobaki', 'Cobaki Lakes', 'Cobar', 'Cobar Park', 'Cobargo', 'Cobark', 'Cobbadah', 'Cobbitty', 'Cobramunga', 'Cockwhy', 'Codrington', 'Coffee Camp', 'Coggan', 'Cogra Bay', 'Coila', 'Coldstream', 'Coleambally', 'Colebee', 'Coledale', 'Colinroobie', 'Colinton', 'Collarenebri', 'Collaroy', 'Collaroy Plateau', 'Collector', 'Collendina', 'Collerina', 'Collie', 'Collingullie', 'Collingwood', 'Collins Creek', 'Collombatti', 'Collum Collum', 'Colly Blue', 'Colo', 'Colo Heights', 'Colo Vale', 'Colongra', 'Colyton', 'Comara', 'Combaning', 'Combara', 'Comberton', 'Comboyne', 'Come By Chance', 'Comerong Island', 'Commissioners Creek', 'Como', 'Comobella', 'Conargo', 'Concord', 'Concord West', 'Condell Park', 'Condobolin', 'Condong', 'Coneac', 'Congarinni', 'Congarinni North', 'Congewai', 'Congo', 'Conimbia', 'Coniston', 'Conjola', 'Conjola Park', 'Connells Point', 'Constitution Hill', 'Coogee', 'Cookamidgera', 'Cookardinia', 'Cooks Gap', 'Cooks Hill', 'Cooks Myalls', 'Coolabah', 'Coolac', 'Coolagolite', 'Coolah', 'Coolamon', 'Coolangatta', 'Coolangubra', 'Coolatai', 'Cooleman', 'Cooleys Creek', 'Coolgardie', 'Coolongolook', 'Coolringdon', 'Coolumbooka', 'Coolumburra', 'Cooma', 'Coomba Bay', 'Coomba Park', 'Coombadjha', 'Coombell', 'Coomealla', 'Coomoo Coomoo', 'Coonabarabran', 'Coonamble', 'Coongbar', 'Cooperabung', 'Coopernook', 'Coopers Gully', 'Coopers Shoot', 'Cooplacurripa', 'Coorabell', 'Cooranbong', 'Cootamundra', 'Cootralantra', 'Cooyal', 'Copacabana', 'Cope', 'Copeland', 'Copeton', 'Copmanhurst', 'Coppabella', 'Copperhannia', 'Coraki', 'Coralville', 'Coramba', 'Corang', 'Corangula', 'Corbie Hill', 'Cordeaux', 'Cordeaux Heights', 'Coree', 'Coreen', 'Corindi Beach', 'Corinella', 'Corlette', 'Corndale', 'Corney Town', 'Cornwallis', 'Corobimilla', 'Corowa', 'Corrabare', 'Corrimal', 'Corrong', 'Corrowong', 'Corunna', 'Cottage Point', 'Cottonvale', 'Cougal', 'Countegany', 'Courabyra', 'Couradda', 'Couragago', 'Couridjah', 'Coutts Crossing', 'Cow Flat', 'Cowabbie', 'Cowan', 'Cowper', 'Cowra', 'Coxs Creek', 'Coxs Crown', 'Crabbes Creek', 'Crackenback', 'Craigie', 'Cranebrook', 'Crangan Bay', 'Craven', 'Craven Plateau', 'Crawford River', 'Crawney', 'Creewah', 'Cremorne', 'Cremorne Point', 'Crescent Head', 'Crestwood', 'Cringila', 'Croki', 'Cromer', 'Cronulla', 'Crooble', 'Croobyar', 'Crooked Corner', 'Crookwell', 'Croom', 'Croppa Creek', 'Cross Roads', 'Crosslands', 'Croudace Bay', 'Crowdy Bay National Park', 'Crowdy Head', 'Crows Nest', 'Crowther', 'Crowther Island', 'Croydon', 'Croydon Park', 'Crudine', 'Cryon', 'Crystal Creek', 'Cubba', 'Cudal', 'Cudgegong', 'Cudgel', 'Cudgen', 'Cudgera Creek', 'Cudmirrah', 'Culburra Beach', 'Culcairn', 'Cullen Bullen', 'Cullenbone', 'Cullendore', 'Cullerin', 'Cullivel', 'Culmaran Creek', 'Cumbalum', 'Cumbandry', 'Cumberland Reach', 'Cumbo', 'Cumborah', 'Cumnock', 'Cundle Flat', 'Cundletown', 'Cundumbul', 'Cunjurong Point', 'Cunningar', 'Cunninyeuk', 'Curban', 'Curl Curl', 'Curlew Waters', 'Curlewis', 'Curlwaa', 'Curra Creek', 'Currabubula', 'Curragh', 'Curramore', 'Currans Hill', 'Currarong', 'Currawang', 'Currawarna', 'Curraweela', 'Curricabark', 'Currowan', 'Cuttabri', 'Cuttagee', 'Dabee', 'Daceyville', 'Dairy Arm', 'Dairy Flat', 'Dairymans Plains', 'Daleys Point', 'Dalgety', 'Dalmeny', 'Dalmorton', 'Dalswinton', 'Dalton', 'Dalwood', 'Dandaloo', 'Dandry', 'Dangar Island', 'Dangarsleigh', 'Dangelong', 'Dapto', 'Darawank', 'Darbalara', 'Darbys Falls', 'Dareton', 'Dargan', 'Dark Corner', 'Darkes Forest', 'Darkwood', 'Darling Point', 'Darlinghurst', 'Darlington', 'Darlington Point', 'Darlow', 'Dartbrook', 'Daruka', 'Davidson', 'Davis Creek', 'Davistown', 'Dawes Point', 'Daysdale', 'Dean Park', 'Deauville', 'Debenham', 'Dee Why', 'Deep Creek', 'Deepwater', 'Deer Vale', 'Delegate', 'Delungra', 'Denham Court', 'Denhams Beach', 'Deniliquin', 'Denistone', 'Denistone East', 'Denistone West', 'Denman', 'Depot Beach', 'Derriwong', 'Deua', 'Deua River Valley', 'Devils Hole', 'Dewitt', 'Dharruk', 'Dhulura', 'Dhuragoon', 'Diamond Beach', 'Diamond Head', 'Diehard', 'Diggers Camp', 'Dignams Creek', 'Dilkoon', 'Dilpurra', 'Dingo Forest', 'Dinoga', 'Dirnaseer', 'Dirty Creek', 'Dobies Bight', 'Doctor George Mountain', 'Doctors Gap', 'Dog Rocks', 'Dolans Bay', 'Dolls Point', 'Dollys Flat', 'Dolphin Point', 'Dombarton', 'Donald Creek', 'Dondingalong', 'Doon Doon', 'Doonbah', 'Doonside', 'Dooralong', 'Dora Creek', 'Dorrigo', 'Dorrigo Mountain', 'Dorroughby', 'Double Bay', 'Doubtful Creek', 'Douglas Park', 'Dover Heights', 'Downside', 'Doyalson', 'Doyalson North', 'Doyles Creek', 'Doyles River', 'Drake', 'Drildool', 'Dripstone', 'Drummoyne', 'Dry Creek', 'Dry Plain', 'Duck Creek', 'Duckenfield', 'Duckmaloi', 'Dudley', 'Duffys Forest', 'Dulguigan', 'Dulwich Hill', 'Dum Dum', 'Dumaresq', 'Dumaresq Island', 'Dumaresq Valley', 'Dumbudgery', 'Dunbible', 'Dunbogan', 'Duncans Creek', 'Dundas', 'Dundas Valley', 'Dundee', 'Dundurrabin', 'Dunedoo', 'Dungarubba', 'Dungay', 'Dungeree', 'Dungog', 'Dungowan', 'Dunkeld', 'Dunmore', 'Dunolly', 'Dunoon', 'Duns Creek', 'Dunville Loop', 'Dural', 'Duramana', 'Duranbah', 'Duri', 'Duroby', 'Durran Durra', 'Durras North', 'Durren Durren', 'Duval', 'Dyers Crossing', 'Dyraaba', 'Dyrring', 'Eagle Vale', 'Eagleton', 'Earlwood', 'East Albury', 'East Ballina', 'East Branxton', 'East Coraki', 'East Corrimal', 'East Gosford', 'East Gresford', 'East Hills', 'East Jindabyne', 'East Kangaloon', 'East Kempsey', 'East Killara', 'East Kurrajong', 'East Lindfield', 'East Lismore', 'East Lynne', 'East Maitland', 'East Ryde', 'East Seaham', 'East Tamworth', 'East Wagga Wagga', 'East Wardell', 'Eastern Creek', 'Eastgardens', 'Eastlakes', 'Eastwood', 'Eatonsville', 'Ebenezer', 'Ebor', 'Eccleston', 'Edderton', 'Eden', 'Eden Creek', 'Edensor Park', 'Edenville', 'Edgecliff', 'Edgeroi', 'Edgeworth', 'Edith', 'Edmondson Park', 'Edrom', 'Eenaweena', 'Eglinton', 'Eighteen Mile', 'Elands', 'Elanora Heights', 'Elcombe', 'Elderslie', 'Eleebana', 'Elermore Vale', 'Elizabeth Bay', 'Elizabeth Beach', 'Elizabeth Hills', 'Ellalong', 'Elland', 'Ellangowan', 'Ellenborough', 'Ellerslie', 'Ellerston', 'Ellis Lane', 'Elong Elong', 'Elrington', 'Elsmore', 'Eltham', 'Elvina Bay', 'Emerald Beach', 'Emerald Hill', 'Emerton', 'Emmaville', 'Empire Bay', 'Empire Vale', 'Emu Heights', 'Emu Plains', 'Emu Swamp', 'Endrick', 'Enfield', 'Engadine', 'Englorie Park', 'Enmore', 'Enngonia', 'Environa', 'Epping', 'Eraring', 'Eremerang', 'Erigolia', 'Erin Vale', 'Erina', 'Erina Heights', 'Ermington', 'Erowal Bay', 'Errowanbang', 'Erskine Park', 'Erskineville', 'Erudgere', 'Eschol Park', 'Esk', 'Essington', 'Estella', 'Ettalong Beach', 'Ettamogah', 'Ettrema', 'Ettrick', 'Euabalong', 'Euabalong West', 'Euberta', 'Euchareena', 'Eucumbene', 'Eugowra', 'Eulah Creek', 'Eumungerie', 'Eunanoreenya', 'Eungai Creek', 'Eungai Rail', 'Eungella', 'Eureka', 'Eurimbla', 'Eurobodalla', 'Euroka', 'Euroley', 'Eurongilly', 'Eurunderee', 'Euston', 'Evans Head', 'Evans Plains', 'Eveleigh', 'Eviron', 'Ewingar', 'Ewingsdale', 'Exeter', 'Failford', 'Fairfield', 'Fairfield East', 'Fairfield Heights', 'Fairfield West', 'Fairholme', 'Fairlight', 'Fairy Hill', 'Fairy Meadow', 'Falbrook', 'Falconer', 'Falls Creek', 'Far Meadow', 'Fargunyah', 'Farley', 'Farmborough Heights', 'Farnham', 'Farrants Hill', 'Farringdon', 'Fassifern', 'Faulconbridge', 'Faulkland', 'Fawcetts Plain', 'Federal', 'Fennell Bay', 'Fern Bay', 'Fern Gully', 'Fernances', 'Fernances Crossing', 'Fernbank Creek', 'Fernbrook', 'Fernhill', 'Fernleigh', 'Fernmount', 'Fernside', 'Fernvale', 'Ferodale', 'Fiddletown', 'Fifield', 'Figtree', 'Findon Creek', 'Fine Flower', 'Fingal Bay', 'Fingal Head', 'Finley', 'Firefly', 'Fishermans Bay', 'Fishermans Paradise', 'Fishermans Reach', 'Fishers Hill', 'Fishing Point', 'Fitzgeralds Mount', 'Fitzgeralds Valley', 'Fitzroy Falls', 'Five Dock', 'Five Ways', 'Flat Tops', 'Fletcher', 'Flinders', 'Floraville', 'Forbes', 'Forbes Creek', 'Forbes River', 'Forbesdale', 'Fords Bridge', 'Fordwich', 'Forest Glen', 'Forest Grove', 'Forest Hill', 'Forest Land', 'Forest Lodge', 'Forest Reefs', 'Forestville', 'Forresters Beach', 'Forster', 'Fortis Creek', 'Fosters Valley', 'Fosterton', 'Fountaindale', 'Four Corners', 'Four Mile Creek', 'Fowlers Gap', 'Foxground', 'Frazer Park', 'Frazers Creek', 'Frederickton', 'Freeburn Island', 'Freemans', 'Freemans Reach', 'Freemans Waterhole', 'Freemantle', 'French Park', 'Frenchs Forest', 'Freshwater', 'Frog Rock', 'Frogmore', 'Frogs Hollow', 'Frying Pan', 'Fullerton', 'Fullerton Cove', 'Furracabad', 'Gadara', 'Gala Vale', 'Galambine', 'Galong', 'Galore', 'Galston', 'Ganbenang', 'Gangat', 'Ganmain', 'Garah', 'Garden Suburb', 'Garema', 'Garland', 'Garland Valley', 'Garoo', 'Garra', 'Garthowen', 'Gateshead', 'Gearys Flat', 'Geehi', 'Gelston Park', 'Gemalla', 'Geneva', 'Georges Creek', 'Georges Hall', 'Georges Plains', 'Georgetown', 'Georgica', 'Gerogery', 'Gerringong', 'Gerroa', 'Geurie', 'Ghinni Ghi', 'Ghinni Ghinni', 'Ghoolendaadi', 'Giants Creek', 'Gibberagee', 'Gibraltar Range', 'Gidginbung', 'Gidley', 'Gilead', 'Gilgai', 'Gilgandra', 'Gilgooma', 'Gilgunnia', 'Gillenbah', 'Gilletts Ridge', 'Gillieston Heights', 'Gilmandyke', 'Gilmore', 'Gin Gin', 'Gineroi', 'Ginghi', 'Gingkin', 'Girards Hill', 'Girilambone', 'Giro', 'Girral', 'Girralong', 'Girraween', 'Girvan', 'Gladesville', 'Gladstone', 'Glanmire', 'Glebe', 'Gledswood Hills', 'Glen Alice', 'Glen Allen', 'Glen Alpine', 'Glen Davis', 'Glen Elgin', 'Glen Fergus', 'Glen Innes', 'Glen Martin', 'Glen Nevis', 'Glen Oak', 'Glen Ward', 'Glen William', 'Glenbawn', 'Glenbrook', 'Glencoe', 'Glendale', 'Glendenning', 'Glendon', 'Glendon Brook', 'Glenelg', 'Glenellen', 'Glenfield', 'Glenfield Park', 'Glengarrie', 'Glenhaven', 'Gleniffer', 'Glenmore', 'Glenmore Park', 'Glennies Creek', 'Glenning Valley', 'Glenorie', 'Glenquarry', 'Glenreagh', 'Glenridding', 'Glenrock', 'Glenroy', 'Glenthorne', 'Glenugie', 'Glenwood', 'Glenworth Valley', 'Glossodia', 'Gloucester', 'Gloucester Tops', 'Goat Island', 'Gobarralong', 'Gobbagombalin', 'Gocup', 'Godfreys Creek', 'Gogeldrie', 'Gol Gol', 'Gollan', 'Golspie', 'Gongolgon', 'Gonn', 'Goobarragandra', 'Good Forest', 'Good Hope', 'Goodnight', 'Goodooga', 'Goodwood Island', 'Googong', 'Goolgowi', 'Goolhi', 'Goolma', 'Goolmangar', 'Gooloogong', 'Goombargana', 'Goonellabah', 'Goonengerry', 'Goonoo Forest', 'Goonoo Goonoo', 'Goonumbla', 'Goorangoola', 'Goorianawa', 'Gordon', 'Gorge Creek', 'Gormans Hill', 'Gorokan', 'Gosford', 'Gosforth', 'Gostwyck', 'Gouldsville', 'Gowan', 'Gowang', 'Gowrie', 'Grabben Gullen', 'Gradys Creek', 'Gragin', 'Grahamstown', 'Graman', 'Grants Beach', 'Granville', 'Grasmere', 'Grassy Head', 'Grattai', 'Gravesend', 'Grays Point', 'Great Mackerel Beach', 'Great Marlow', 'Green Cape', 'Green Creek', 'Green Forest', 'Green Gully', 'Green Hills', 'Green Pigeon', 'Green Point', 'Green Valley', 'Greenacre', 'Greendale', 'Greenethorpe', 'Greenfield Park', 'Greengrove', 'Greenhill', 'Greenhills Beach', 'Greenlands', 'Greenleigh', 'Greenridge', 'Greenwell Point', 'Greenwich', 'Greenwich Park', 'Greg Greg', 'Gregadoo', 'Gregory Hills', 'Greigs Flat', 'Grenfell', 'Gresford', 'Greta', 'Greta Main', 'Grevillia', 'Greystanes', 'Grogan', 'Grong Grong', 'Grose Vale', 'Grose Wold', 'Grosses Plain', 'Growee', 'Guerilla Bay', 'Guildford', 'Guildford West', 'Gulargambone', 'Gulf Creek', 'Gulgong', 'Gulmarrad', 'Gum Flat', 'Gum Scrub', 'Gumbalie', 'Gumble', 'Gumly Gumly', 'Gumma', 'Gunbar', 'Gundagai', 'Gundamulda', 'Gundaroo', 'Gundary', 'Gunderbooka', 'Gunderman', 'Gundy', 'Gungal', 'Gungalman', 'Gunnedah', 'Gunning', 'Gunning Gap', 'Gunningbland', 'Gunningrah', 'Gurley', 'Gurnang', 'Gurranang', 'Gurrundah', 'Guyong', 'Guyra', 'Gwabegar', 'Gwandalan', 'Gwynneville', 'Gymea', 'Gymea Bay', 'Haberfield', 'Hacks Ferry', 'Halekulani', 'Halfway Creek', 'Hallidays Point', 'Halloran', 'Halls Creek', 'Hallsville', 'Halton', 'Hambledon Hill', 'Hamilton', 'Hamilton East', 'Hamilton North', 'Hamilton South', 'Hamilton Valley', 'Hamlyn Terrace', 'Hammondville', 'Hampden Hall', 'Hampton', 'Hanging Rock', 'Hanleys Creek', 'Hannam Vale', 'Hanwood', 'Harden', 'Hardys Bay', 'Harefield', 'Hargraves', 'Harolds Cross', 'Harparary', 'Harpers Hill', 'Harrington', 'Harrington Park', 'Harris Park', 'Hartley', 'Hartley Vale', 'Hartwood', 'Hartys Plains', 'Harwood', 'Hassall Grove', 'Hassans Walls', 'Hastings Point', 'Hat Head', 'Hatfield', 'Havilah', 'Hawkesbury Heights', 'Hawks Nest', 'Hay', 'Hay South', 'Hayes Gap', 'Haymarket', 'Haystack', 'Hayters Hill', 'Haywards Bay', 'Hazelbrook', 'Hazelgrove', 'Heathcote', 'Heatherbrae', 'Hebden', 'Hebersham', 'Heckenberg', 'Heddon Greta', 'Heifer Station', 'Helensburgh', 'Henley', 'Henty', 'Hereford Hall', 'Hermidale', 'Hermitage Flat', 'Hernani', 'Herons Creek', 'Hexham', 'Hickeys Creek', 'High Range', 'Higher Macdonald', 'Highfields', 'Hill End', 'Hill Top', 'Hilldale', 'Hillgrove', 'Hillsborough', 'Hillsdale', 'Hillston', 'Hillville', 'Hillvue', 'Hinchinbrook', 'Hinton', 'Hobartville', 'Hobbys Yards', 'Hogarth Range', 'Holbrook', 'Holgate', 'Hollisdale', 'Hollydeen', 'Holmesville', 'Holroyd', 'Holsworthy', 'Holts Flat', 'Home Rule', 'Homebush', 'Homebush West', 'Homeleigh', 'Honeybugle', 'Hopefield', 'Hopkins Creek', 'Horningsea Park', 'Hornsby', 'Hornsby Heights', 'Horse Station Creek', 'Horseshoe Bend', 'Horseshoe Creek', 'Horsfield Bay', 'Horsley', 'Horsley Park', 'Hoskinstown', 'Hovells Creek', 'Howards Grass', 'Howell', 'Howes Valley', 'Howick', 'Howlong', 'Hoxton Park', 'Humula', 'Hungerford', 'Hunters Hill', 'Hunterview', 'Huntingdon', 'Huntingwood', 'Huntley', 'Huntleys Cove', 'Huntleys Point', 'Huonbrook', 'Hurlstone Park', 'Hurstville', 'Hurstville Grove', 'Huskisson', 'Hyams Beach', 'Hyland Park', 'Hyndmans Creek', 'Ilarwill', 'Ilford', 'Illabo', 'Illaroo', 'Illawong', 'Iluka', 'Indi', 'Ingebirah', 'Ingleburn', 'Ingleside', 'Innes View', 'Inverell', 'Invergordon', 'Invergowrie', 'Iron Pot Creek', 'Ironbark', 'Ironmungy', 'Irvington', 'Irymple', 'Isabella', 'Islington', 'Ivanhoe', 'Jackadgery', 'Jacks Creek', 'Jacksons Flat', 'Jacky Bulbin Flat', 'Jagumba', 'Jagungal Wilderness', 'Jamberoo', 'James Creek', 'Jamisontown', 'Jannali', 'Jaspers Brush', 'Jaunter', 'Jeir', 'Jellat Jellat', 'Jemalong', 'Jembaicumbene', 'Jennings', 'Jenolan', 'Jeogla', 'Jerangle', 'Jeremadra', 'Jeremy', 'Jerilderie', 'Jerrabattgulla', 'Jerrabomberra', 'Jerrara', 'Jerrawa', 'Jerrawangala', 'Jerrong', 'Jerrys Plains', 'Jerseyville', 'Jesmond', 'Jewells', 'Jews Lagoon', 'Jiggi', 'Jilliby', 'Jimenbuen', 'Jincumbilly', 'Jindabyne', 'Jinden', 'Jindera', 'Jingellic', 'Jingera', 'Joadja', 'Joes Box', 'Johns River', 'Jolly Nose', 'Jones Bridge', 'Jones Creek', 'Jones Island', 'Jordan Springs', 'Judds Creek', 'Jugiong', 'Junction Hill', 'Junee', 'Junee Reefs', 'Kahibah', 'Kains Flat', 'Kalang', 'Kalaru', 'Kalkite', 'Kamarah', 'Kameruka', 'Kanahooka', 'Kanangra', 'Kandos', 'Kangaloon', 'Kangaroo Creek', 'Kangaroo Point', 'Kangaroo Valley', 'Kangaroobie', 'Kangiara', 'Kangy Angy', 'Kanimbla', 'Kanoona', 'Kanwal', 'Kapooka', 'Kaputar', 'Karaak Flat', 'Karabar', 'Karangi', 'Kareela', 'Kariong', 'Kars Springs', 'Karuah', 'Katoomba', 'Kayuga', 'Kearns', 'Kearsley', 'Keepit', 'Keera', 'Keerrong', 'Keinbah', 'Keiraville', 'Keith Hall', 'Kellys Plains', 'Kellyville', 'Kellyville Ridge', 'Kelso', 'Kelvin', 'Kembla Grange', 'Kembla Heights', 'Kemps Creek', 'Kempsey', 'Kendall', 'Kenebri', 'Kennaicle Creek', 'Kensington', 'Kenthurst', 'Kentlyn', 'Kentucky', 'Kentucky South', 'Kerewong', 'Keri Keri', 'Kerrabee', 'Kerrigundi', 'Kerrs Creek', 'Kew', 'Keybarbin', 'Khancoban', 'Khatambuhl', 'Kia Ora', 'Kiacatoo', 'Kiah', 'Kiama', 'Kiama Downs', 'Kiama Heights', 'Kianga', 'Kiar', 'Kickabil', 'Kielvale', 'Kikiamah', 'Kikoira', 'Kilaben Bay', 'Kilgin', 'Kilgra', 'Killabakh', 'Killara', 'Killarney Heights', 'Killarney Vale', 'Killawarra', 'Killcare', 'Killcare Heights', 'Killiekrankie', 'Killimicat', 'Killingworth', 'Killongbutta', 'Kimbriki', 'Kinchela', 'Kincumber', 'Kincumber South', 'Kindee', 'Kindervale', 'King Creek', 'Kingfisher Shores', 'Kinghorne', 'Kings Forest', 'Kings Langley', 'Kings Park', 'Kings Plains', 'Kings Point', 'Kingscliff', 'Kingsdale', 'Kingsford', 'Kingsgate', 'Kingsgrove', 'Kingsland', 'Kingstown', 'Kingsvale', 'Kingswood', 'Kioloa', 'Kiora', 'Kippara', 'Kippaxs', 'Kippenduff', 'Kirkconnell', 'Kirkham', 'Kirrawee', 'Kirribilli', 'Kitchener', 'Kiwarrak', 'Klori', 'Knights Hill', 'Knockrow', 'Knorrit Flat', 'Knorrit Forest', 'Kogarah', 'Kogarah Bay', 'Kooba', 'Kookabookra', 'Koolewong', 'Koolkhan', 'Koonawarra', 'Koonorigan', 'Koonyum Range', 'Kooragang', 'Koorainghat', 'Koorawatha', 'Kooringal', 'Kootingal', 'Koraleigh', 'Koreelah', 'Korora', 'Kosciuszko', 'Kosciuszko National Park', 'Kotara', 'Kotara South', 'Krambach', 'Krawarree', 'Kremnos', 'Ku-Ring-Gai Chase', 'Kulnura', 'Kulwin', 'Kunama', 'Kundabung', 'Kundibakh', 'Kundle Kundle', 'Kungala', 'Kunghur', 'Kunghur Creek', 'Kurmond', 'Kurnell', 'Kurraba Point', 'Kurrajong', 'Kurrajong Heights', 'Kurrajong Hills', 'Kurri Kurri', 'Kyalite', 'Kyarran', 'Kybeyan', 'Kyeamba', 'Kyeemagh', 'Kyle Bay', 'Kynnumboon', 'Kyogle', 'La Perouse', 'Lacmalac', 'Lade Vale', 'Ladysmith', 'Laffing Waters', 'Laggan', 'Lagoon Grass', 'Laguna', 'Lake Albert', 'Lake Bathurst', 'Lake Brewster', 'Lake Burrendong', 'Lake Cargelligo', 'Lake Cathie', 'Lake Conjola', 'Lake Cowal', 'Lake George', 'Lake Haven', 'Lake Heights', 'Lake Hume Village', 'Lake Illawarra', 'Lake Innes', 'Lake Macquarie', 'Lake Munmorah', 'Lake Tabourie', 'Lake Wyangan', 'Lakelands', 'Lakemba', 'Lakesland', 'Lakewood', 'Lalalty', 'Lalor Park', 'Lambs Valley', 'Lambton', 'Landervale', 'Lane Cove', 'Lane Cove North', 'Lane Cove West', 'Langley Vale', 'Lanitza', 'Lankeys Creek', 'Lansdowne', 'Lansdowne Forest', 'Lansvale', 'Lapstone', 'Larbert', 'Largs', 'Larnook', 'Larras Lee', 'Laughtondale', 'Laurel Hill', 'Laurieton', 'Lavadia', 'Lavender Bay', 'Laverstock', 'Lavington', 'Lawrence', 'Lawson', 'Leadville', 'Leconfield', 'Lee Creek', 'Leeton', 'Leets Vale', 'Leeville', 'Legume', 'Leichhardt', 'Lemington', 'Lemon Tree', 'Lemon Tree Passage', 'Len Waters Estate', 'Lenaghan', 'Lennox Head', 'Leonay', 'Leppington', 'Lerida', 'Lethbridge Park', 'Leumeah', 'Leura', 'Levenstrath', 'Lewinsbrook', 'Lewis Ponds', 'Lewisham', 'Leycester', 'Liberty Grove', 'Lidcombe', 'Liddell', 'Lidsdale', 'Lidster', 'Lightning Ridge', 'Lilli Pilli', 'Lillian Rock', 'Lilydale', 'Lilyfield', 'Lilyvale', 'Limbri', 'Limeburners Creek', 'Limekilns', 'Limerick', 'Limestone', 'Limpinwood', 'Linburn', 'Linden', 'Lindendale', 'Lindesay', 'Lindesay Creek', 'Lindfield', 'Lindifferon', 'Linley Point', 'Lionsville', 'Lisarow', 'Lismore Heights', 'Liston', 'Lithgow', 'Little Back Creek', 'Little Bay', 'Little Billabong', 'Little Forest', 'Little Hartley', 'Little Jacks Creek', 'Little Jilliby', 'Little Pelican', 'Little Plain', 'Little River', 'Little Topar', 'Little Wobby', 'Littleton', 'Liverpool', 'Llanarth', 'Llandilo', 'Llangothlin', 'Lloyd', 'Loadstone', 'Lochiel', 'Lochinvar', 'Lockhart', 'Locksley', 'Loftus', 'Loftville', 'Logans Crossing', 'Logie Brae', 'Londonderry', 'Long Beach', 'Long Flat', 'Long Jetty', 'Long Plain', 'Long Point', 'Longarm', 'Longreach', 'Longueville', 'Loomberah', 'Lord Howe Island', 'Lords Hill', 'Lorn', 'Lorne', 'Lost River', 'Lostock', 'Louisa Creek', 'Louth', 'Louth Park', 'Lovedale', 'Lovett Bay', 'Lowanna', 'Lower Acacia Creek', 'Lower Bago', 'Lower Belford', 'Lower Boro', 'Lower Bottle Creek', 'Lower Creek', 'Lower Duck Creek', 'Lower Dyraaba', 'Lower Lewis Ponds', 'Lower Macdonald', 'Lower Mangrove', 'Lower Pappinbarra', 'Lower Peacock', 'Lower Portland', 'Lower Southgate', 'Lowesdale', 'Lowther', 'Loxford', 'Lucas Heights', 'Lucknow', 'Luddenham', 'Lue', 'Lugarno', 'Lurnea', 'Luskintyre', 'Lynchs Creek', 'Lyndhurst', 'Lynwood', 'Mabins Well', 'Macdonalds Creek', 'Macksville', 'Maclean', 'Macmasters Beach', 'Macquarie Fields', 'Macquarie Hills', 'Macquarie Links', 'Macquarie Marshes', 'Macquarie Park', 'Macquarie Pass', 'Maddens Plains', 'Maffra', 'Magenta', 'Magometon', 'Maianbar', 'Maimuru', 'Main Arm', 'Main Creek', 'Mairjimmy', 'Maison Dieu', 'Maitland', 'Maitland Bar', 'Maitland Vale', 'Majors Creek', 'Malabar', 'Maldon', 'Mallabula', 'Mallan', 'Mallanganee', 'Mallee', 'Mallowa', 'Maloneys Beach', 'Malua Bay', 'Manar', 'Manchester Square', 'Mandagery', 'Mandalong', 'Mandemar', 'Mandurama', 'Mangerton', 'Mangoola', 'Mangoplah', 'Mangrove Creek', 'Mangrove Mountain', 'Manildra', 'Manilla', 'Manly', 'Manly Vale', 'Mannering Park', 'Manning Point', 'Mannus', 'Manobalai', 'Manton', 'Manyana', 'Maragle', 'Maraylya', 'Marayong', 'March', 'Marchmont', 'Mardi', 'Marengo', 'Mares Run', 'Marinna', 'Marks Point', 'Markwell', 'Marlee', 'Marlo Merrican', 'Marlow', 'Marlowe', 'Marmong Point', 'Marom Creek', 'Maroota', 'Maroubra', 'Marrangaroo', 'Marrar', 'Marrickville', 'Marsden Park', 'Marsfield', 'Marshall Mount', 'Marshdale', 'Marthaguy', 'Martindale', 'Martins Creek', 'Martinsville', 'Marulan', 'Maryland', 'Marys Mount', 'Maryvale', 'Maryville', 'Mascot', 'Matcham', 'Matheson', 'Mathoura', 'Matong', 'Matraville', 'Maude', 'Maules Creek', 'Maxwell', 'Maybole', 'Mayers Flat', 'Mayfield', 'Mayfield East', 'Mayfield North', 'Mayfield West', 'Mayrung', 'Mays Hill', 'Mayvale', 'McCullys Gap', 'McDougalls Hill', 'McGraths Hill', 'McKees Hill', 'McKellars Park', 'McLeans Ridges', 'McLeods Shoot', 'McMahons Point', 'McMahons Reef', 'Meadow Flat', 'Meadowbank', 'Mebbin', 'Mebul', 'Medlow Bath', 'Medowie', 'Medway', 'Meerschaum Vale', 'Megalong Valley', 'Megan', 'Melbergen', 'Melinga', 'Mellong', 'Mellool', 'Melrose Park', 'Melville', 'Memagong', 'Menah', 'Menai', 'Menangle', 'Menangle Park', 'Mendooran', 'Menindee', 'Merah North', 'Merewether', 'Merewether Heights', 'Merimbula', 'Meringo', 'Mernot', 'Meroo', 'Meroo Meadow', 'Merotherie', 'Merriangaah', 'Merricumbene', 'Merrigal', 'Merrill', 'Merriwa', 'Merriwagga', 'Merrygoen', 'Merrylands', 'Merrylands West', 'Merungle Hill', 'Meryla', 'Metford', 'Methul', 'Metz', 'Miamley', 'Miandetta', 'Micalo Island', 'Michelago', 'Middle Arm', 'Middle Brook', 'Middle Brother', 'Middle Cove', 'Middle Dural', 'Middle Falbrook', 'Middle Flat', 'Middle Pocket', 'Middleton Grange', 'Middlingbank', 'Midginbil', 'Mihi', 'Mila', 'Milbrodale', 'Milbrulong', 'Milkers Flat', 'Millah Murrah', 'Millbank', 'Miller', 'Millers Forest', 'Millers Point', 'Millfield', 'Millie', 'Millingandi', 'Millthorpe', 'Milparinka', 'Milperra', 'Milroy', 'Milsons Passage', 'Milsons Point', 'Milton', 'Milvale', 'Mimosa', 'Minchinbury', 'Mindaribba', 'Mingoola', 'Minimbah', 'Minjary', 'Minmi', 'Minnamurra', 'Minnie Water', 'Minore', 'Minto', 'Minto Heights', 'Mirador', 'Miranda', 'Mirannie', 'Mirrabooka', 'Mirrool', 'Missabotti', 'Mitchell', 'Mitchells Flat', 'Mitchells Island', 'Mittagong', 'Moama', 'Modanville', 'Mogareeka', 'Mogendoura', 'Moggs Swamp', 'Mogilla', 'Mogo', 'Mogo Creek', 'Mogood', 'Mograni', 'Mogriguy', 'Mole River', 'Moleville Creek', 'Mollyan', 'Mollymook', 'Mollymook Beach', 'Molong', 'Mona Vale', 'Monak', 'Monaltrie', 'Mondayong', 'Mondrook', 'Monga', 'Mongarlowe', 'Mongogarie', 'Monia Gap', 'Monivae', 'Monkerai', 'Monteagle', 'Montecollum', 'Montefiores', 'Monterey', 'Mooball', 'Moobi', 'Moogem', 'Mookerawa', 'Mookima Wybra', 'Moolarben', 'Moollattoo', 'Moolpa', 'Moombooldool', 'Moonan Brook', 'Moonan Flat', 'Moonbah', 'Moonbi', 'Moonbria', 'Mooneba', 'Moonee', 'Moonee Beach', 'Mooney Mooney', 'Mooney Mooney Creek', 'Moonpar', 'Mooral Creek', 'Moorara', 'Moorbel', 'Moore Creek', 'Moore Park', 'Moorebank', 'Moorilda', 'Moorland', 'Moorong', 'Moorwatha', 'Moparrabah', 'Moppy', 'Morago', 'Morangarell', 'Morans Crossing', 'Moree', 'Morisset', 'Morisset Park', 'Morning Bay', 'Mororo', 'Morpeth', 'Mortdale', 'Mortlake', 'Morton', 'Mortons Creek', 'Morts Estate', 'Morundah', 'Moruya', 'Moruya Heads', 'Morven', 'Mosman', 'Moss Vale', 'Mossgiel', 'Mossy Point', 'Moto', 'Moulamein', 'Mount Adrah', 'Mount Annan', 'Mount Aquila', 'Mount Arthur', 'Mount Austin', 'Mount Burrell', 'Mount Colah', 'Mount Collins', 'Mount Cooper', 'Mount Darragh', 'Mount David', 'Mount Dee', 'Mount Druitt', 'Mount Elliot', 'Mount Fairy', 'Mount Foster', 'Mount Frome', 'Mount George', 'Mount Harris', 'Mount Hope', 'Mount Horeb', 'Mount Hunter', 'Mount Hutton', 'Mount Irvine', 'Mount Keira', 'Mount Kembla', 'Mount Kingiman', 'Mount Knowles', 'Mount Kuring-Gai', 'Mount Lambie', 'Mount Lewis', 'Mount Lindsey', 'Mount Marsden', 'Mount Marsh', 'Mount Mitchell', 'Mount Murray', 'Mount Olive', 'Mount Ousley', 'Mount Panorama', 'Mount Pleasant', 'Mount Pritchard', 'Mount Rankin', 'Mount Rivers', 'Mount Riverview', 'Mount Royal', 'Mount Russell', 'Mount Saint Thomas', 'Mount Seaview', 'Mount Tenandra', 'Mount Thorley', 'Mount Tomah', 'Mount Vernon', 'Mount Victoria', 'Mount View', 'Mount Vincent', 'Mount Warning', 'Mount Warrigal', 'Mount Werong', 'Mount White', 'Mount Wilson', 'Mountain Creek', 'Mountain Lagoon', 'Mountain Top', 'Mountain View', 'Mourquong', 'Mowbray Park', 'Mozart', 'Mudgee', 'Mulbring', 'Mulgoa', 'Mulgrave', 'Mulguthrie', 'Muli Muli', 'Mulla', 'Mulla Creek', 'Mullaley', 'Mullamuddy', 'Mullaway', 'Mullengandra', 'Mullengudgery', 'Mullion', 'Mullion Creek', 'Mulloon', 'Mullumbimby', 'Mullumbimby Creek', 'Mulwala', 'Mulyandry', 'Mumbil', 'Mumblebone Plain', 'Mumbulla Mountain', 'Mummel', 'Mummulgum', 'Mundamia', 'Mundarlo', 'Munderoo', 'Mundongo', 'Mungay Creek', 'Munghorn', 'Mungindi', 'Mungo', 'Mungo Brush', 'Munni', 'Munyabla', 'Murga', 'Murrah', 'Murrami', 'Murrawombie', 'Murray Downs', 'Murray Gorge', 'Murrays Beach', 'Murrays Run', 'Murrengenburg', 'Murrin Bridge', 'Murringo', 'Murrulebale', 'Murrumbateman', 'Murrumbo', 'Murrumbucca', 'Murrumburrah', 'Murrurundi', 'Murulla', 'Murwillumbah', 'Muscle Creek', 'Muswellbrook', 'Mutawintji', 'Muttama', 'Myall Creek', 'Myall Lake', 'Myall Park', 'Myalla', 'Mylestom', 'Mylneford', 'Myocum', 'Myola', 'Myrtle Creek', 'Myrtle Mountain', 'Myrtle Park', 'Myrtleville', 'Mystery Bay', 'Myuna Bay', 'Nabiac', 'Nadgee', 'Nambucca Heads', 'Namoi River', 'Nana Glen', 'Nangus', 'Nanima', 'Napier Lane', 'Napoleon Reef', 'Naradhan', 'Narara', 'Narellan', 'Narellan Vale', 'Naremburn', 'Narone Creek', 'Narooma', 'Narrabarba', 'Narrabeen', 'Narrabri', 'Narraburra', 'Narran Lake', 'Narrandera', 'Narrangullen', 'Narrawa', 'Narrawallee', 'Narraweena', 'Narromine', 'Narwee', 'Nashdale', 'Nashua', 'Nattai', 'Naughtons Gap', 'Neath', 'Nebea', 'Neilrex', 'Nelligen', 'Nelson', 'Nelson Bay', 'Nelsons Plains', 'Nelungaloo', 'Nemingha', 'Nericon', 'Neringla', 'Nerong', 'Nerriga', 'Nerrigundah', 'Nethercote', 'Neurea', 'Neutral Bay', 'Never Never', 'Nevertire', 'Neville', 'New Berrima', 'New Brighton', 'New Buildings', 'New Italy', 'New Lambton', 'New Lambton Heights', 'New Mexico', 'New Park', 'New Valley', 'Newbold', 'Newbridge', 'Newcastle East', 'Newcastle West', 'Newee Creek', 'Newington', 'Newnes', 'Newnes Plateau', 'Newport', 'Newrybar', 'Newstead', 'Newton Boyd', 'Newtown', 'Niagara Park', 'Niangala', 'Niemur', 'Nightcap', 'Nimbin', 'Nimmitabel', 'Nimmo', 'Nobbys Creek', 'Nombi', 'Noona', 'Noorong', 'Nooroo', 'Norah Head', 'Noraville', 'Nords Wharf', 'Normanhurst', 'North Albury', 'North Arm', 'North Arm Cove', 'North Avoca', 'North Balgowlah', 'North Batemans Bay', 'North Boambee Valley', 'North Bondi', 'North Bourke', 'North Brother', 'North Casino', 'North Curl Curl', 'North Dorrigo', 'North Epping', 'North Gosford', 'North Haven', 'North Lambton', 'North Lismore', 'North Macksville', 'North Macquarie', 'North Manly', 'North Narooma', 'North Narrabeen', 'North Nowra', 'North Parramatta', 'North Richmond', 'North Rocks', 'North Rothbury', 'North Ryde', 'North Shore', 'North St Marys', 'North Star', 'North Strathfield', 'North Sydney', 'North Tamworth', 'North Tumbulgum', 'North Turramurra', 'North Wagga Wagga', 'North Wahroonga', 'North Willoughby', 'North Wollongong', 'North Woodburn', 'North Yalgogrin', 'North Yeoval', 'Northangera', 'Northbridge', 'Northmead', 'Northwood', 'Norway', 'Nowendoc', 'Nowley', 'Nowra', 'Nowra Hill', 'Nubba', 'Nulkaba', 'Nullamanna', 'Nullica', 'Nullo Mountain', 'Numbaa', 'Number One', 'Numbla Vale', 'Numbugga', 'Numeralla', 'Numinbah', 'Numulgi', 'Nunderi', 'Nundle', 'Nungatta', 'Nungatta South', 'Nurenmerenmong', 'Nymagee', 'Nymboida', 'Nyngan', 'Nyora', 'Nyrang Creek', 'O\'Connell', 'Oak Flats', 'Oakdale', 'Oakey Park', 'Oakhampton', 'Oakhampton Heights', 'Oakhurst', 'Oaklands', 'Oakville', 'Oakwood', 'Oallen', 'Oatlands', 'Oatley', 'Oban', 'Obanvale', 'Oberne Creek', 'Oberon', 'Obley', 'Ocean Shores', 'Ogunbil', 'Old Adaminaby', 'Old Bar', 'Old Bonalbo', 'Old Erowal Bay', 'Old Grevillia', 'Old Guildford', 'Old Junee', 'Old Mill', 'Old Station', 'Old Toongabbie', 'Olinda', 'Olney', 'Omadale', 'One Mile', 'One Tree', 'Oolong', 'Ooma', 'Ootha', 'Ophir', 'Oran Park', 'Orange Grove', 'Orangeville', 'Orchard Hills', 'Orient Point', 'Orton Park', 'Osborne', 'Osterley', 'Oswald', 'Otford', 'Oura', 'Ourimbah', 'Ournie', 'Owens Gap', 'Oxford Falls', 'Oxley', 'Oxley Island', 'Oxley Park', 'Oxley Vale', 'Oyster Bay', 'Oyster Cove', 'Packsaddle', 'Paddington', 'Paddys Flat', 'Paddys River', 'Padstow', 'Padstow Heights', 'Pagans Flat', 'Pages Creek', 'Pages River', 'Pagewood', 'Palarang', 'Palerang', 'Paling Yards', 'Pallal', 'Pallamallawa', 'Palm Beach', 'Palm Grove', 'Palmdale', 'Palmers Channel', 'Palmers Island', 'Palmers Oaky', 'Palmvale', 'Palmwoods', 'Pambula', 'Pambula Beach', 'Pampoolah', 'Pan Ban', 'Panania', 'Pangee', 'Panuara', 'Pappinbarra', 'Para', 'Paradise', 'Paringi', 'Parkes', 'Parkesbourne', 'Parklea', 'Parkville', 'Parma', 'Parramatta', 'Parraweena', 'Patchs Beach', 'Paterson', 'Patonga', 'Paupong', 'Paxton', 'Paynes Crossing', 'Paytens Bridge', 'Peacock Creek', 'Peak Hill', 'Peak View', 'Peakhurst', 'Peakhurst Heights', 'Pearces Creek', 'Pearl Beach', 'Peats Ridge', 'Pebbly Beach', 'Peel', 'Peelwood', 'Pejar', 'Pelaw Main', 'Pelican', 'Pelton', 'Pembrooke', 'Pemulwuy', 'Pendle Hill', 'Pennant Hills', 'Penrith', 'Penrose', 'Penshurst', 'Pericoe', 'Perrys Crossing', 'Perthville', 'Petersham', 'Pheasants Nest', 'Phegans Bay', 'Phillip Bay', 'Phoenix Park', 'Piallamore', 'Piallaway', 'Piambong', 'Picketts Valley', 'Picnic Point', 'Picton', 'Pigeonbah', 'Piggabeen', 'Pikapene', 'Pillar Valley', 'Pilliga', 'Pilot Wilderness', 'Pimlico', 'Pimlico Island', 'Pinbeyan', 'Pindaroi', 'Pindimar', 'Pine Camp', 'Pine Clump', 'Pine Grove', 'Pine Lodge', 'Pine Ridge', 'Pine Valley', 'Piney Range', 'Pinkett', 'Pinnacle', 'Pinnacle Swamp', 'Pinny Beach', 'Piora', 'Pipeclay', 'Pitnacree', 'Pitt Town', 'Pitt Town Bottoms', 'Pleasant Hills', 'Pleasure Point', 'Plumpton', 'Point Clare', 'Point Frederick', 'Point Piper', 'Point Wolstoncroft', 'Pointer Mountain', 'Pokolbin', 'Pola Creek', 'Polo Flat', 'Pomeroy', 'Pomona', 'Ponto', 'Pooncarie', 'Port Botany', 'Port Hacking', 'Port Kembla', 'Port Stephens', 'Porters Creek', 'Porters Retreat', 'Portland', 'Possum Brush', 'Possum Creek', 'Potato Point', 'Pottery Estate', 'Potts Hill', 'Potts Point', 'Pottsville', 'Prairiewood', 'Premer', 'Prestons', 'Pretty Beach', 'Pretty Pine', 'Primbee', 'Primrose Valley', 'Prospect', 'Pucawan', 'Puddledock', 'Pulganbar', 'Pullabooka', 'Pulletop', 'Pumpenbil', 'Punchbowl', 'Purfleet', 'Purlewaugh', 'Putney', 'Putta Bucca', 'Putty', 'Pyangle', 'Pymble', 'Pyramul', 'Pyree', 'Pyrmont', 'Quaama', 'Quakers Hill', 'Quambone', 'Quanda', 'Quandary', 'Quandialla', 'Queanbeyan East', 'Queanbeyan West', 'Queens Park', 'Queens Pinch', 'Queenscliff', 'Quialigo', 'Quidong', 'Quiera', 'Quipolly', 'Quirindi', 'Quorrobolong', 'Raby', 'Raglan', 'Rainbow Flat', 'Rainbow Reach', 'Raleigh', 'Ramornie', 'Ramsgate', 'Ramsgate Beach', 'Rand', 'Randwick', 'Rangari', 'Rangers Valley', 'Rankin Park', 'Rankins Springs', 'Rannock', 'Rappville', 'Rathmines', 'Ravensdale', 'Ravenswood', 'Ravensworth', 'Rawdon Island', 'Rawdon Vale', 'Raworth', 'Rawsonville', 'Raymond Terrace', 'Razorback', 'Red Head', 'Red Hill', 'Red Range', 'Red Rock', 'Red Rocks', 'Redbank', 'Redbournberry', 'Reddestone', 'Redfern', 'Redhead', 'Redlands', 'Reedy Creek', 'Reedy Swamp', 'Reefton', 'Regents Park', 'Regentville', 'Reids Flat', 'Reidsdale', 'Rennie', 'Renwick', 'Repentance Creek', 'Repton', 'Reserve Creek', 'Retreat', 'Revesby', 'Revesby Heights', 'Rhine Falls', 'Rhodes', 'Richlands', 'Richmond', 'Richmond Hill', 'Richmond Lowlands', 'Richmond Vale', 'Rileys Hill', 'Ringwood', 'Riverlea', 'Riverside', 'Riverstone', 'Rivertree', 'Riverview', 'Riverwood', 'Rixs Creek', 'Rob Roy', 'Robertson', 'Robin Hill', 'Rock Flat', 'Rock Forest', 'Rock Valley', 'Rockdale', 'Rockley', 'Rockley Mount', 'Rockton', 'Rocky Creek', 'Rocky Glen', 'Rocky Hall', 'Rocky Plain', 'Rocky Point', 'Rocky River', 'Rodd Point', 'Rollands Plains', 'Rookhurst', 'Rookwood', 'Rooty Hill', 'Ropers Road', 'Ropes Crossing', 'Rose Bay', 'Rose Valley', 'Rosebank', 'Roseberg', 'Roseberry', 'Roseberry Creek', 'Rosebery', 'Rosebrook', 'Rosedale', 'Rosehill', 'Roselands', 'Rosemeadow', 'Rosemeath', 'Roseville', 'Roseville Chase', 'Rosewood', 'Roslyn', 'Rossglen', 'Rossgole', 'Rossi', 'Rossmore', 'Roto', 'Rouchel', 'Rouchel Brook', 'Roughit', 'Round Mountain', 'Round Swamp', 'Rous', 'Rous Mill', 'Rouse Hill', 'Rowan', 'Rowena', 'Rowlands Creek', 'Royal National Park', 'Royalla', 'Rozelle', 'Ruby Creek', 'Rufus', 'Rugby', 'Rukenvale', 'Run-o-Waters', 'Running Stream', 'Runnyford', 'Ruse', 'Rushcutters Bay', 'Rushes Creek', 'Rushforth', 'Russell Lea', 'Russell Vale', 'Rutherford', 'Ruthven', 'Ryan', 'Rydal', 'Rydalmere', 'Ryde', 'Rye Park', 'Ryhope', 'Rylstone', 'Sackville', 'Sackville North', 'Saddleback Mountain', 'Sadleir', 'Safety Beach', 'Salamander Bay', 'Salisbury', 'Salisbury Plains', 'Sallys Flat', 'Salt Ash', 'Saltwater', 'San Isidore', 'San Remo', 'Sancrox', 'Sanctuary Point', 'Sandbar', 'Sandgate', 'Sandigo', 'Sandilands', 'Sandon', 'Sandringham', 'Sandy Beach', 'Sandy Creek', 'Sandy Crossing', 'Sandy Flat', 'Sandy Gully', 'Sandy Hill', 'Sandy Hollow', 'Sandy Point', 'Sanger', 'Sans Souci', 'Sapphire', 'Sapphire Beach', 'Saratoga', 'Sassafras', 'Saumarez', 'Saumarez Ponds', 'Savernake', 'Sawpit Creek', 'Sawtell', 'Sawyers Gully', 'Scarborough', 'Scheyville', 'Schofields', 'Scone', 'Scotia', 'Scotland Island', 'Scotts Creek', 'Scotts Flat', 'Scotts Head', 'Seaforth', 'Seaham', 'Seahampton', 'Seal Rocks', 'Sebastopol', 'Sedgefield', 'Seelands', 'Sefton', 'Segenhoe', 'Seven Hills', 'Seven Oaks', 'Sextonville', 'Shadforth', 'Shallow Bay', 'Shalvey', 'Shanes Park', 'Shannon Brook', 'Shannon Vale', 'Shannondale', 'Shannons Flat', 'Shark Creek', 'Sharps Creek', 'Sheedys Gully', 'Shell Cove', 'Shellharbour', 'Shellharbour City Centre', 'Shelly Beach', 'Sherwood', 'Shoal Bay', 'Shoalhaven Heads', 'Shooters Hill', 'Shortland', 'Silent Grove', 'Silverdale', 'Silverton', 'Silverwater', 'Simpkins Creek', 'Singleton', 'Singleton Heights', 'Singleton Military Area', 'Singletons Mill', 'Six Mile Swamp', 'Skennars Head', 'Skillion Flat', 'Skinners Shoot', 'Sleepy Hollow', 'Smeaton Grange', 'Smithfield', 'Smiths Creek', 'Smiths Lake', 'Smithtown', 'Snakes Plain', 'Snowball', 'Snowy Plain', 'Sodwalls', 'Sofala', 'Soldiers Point', 'Somersby', 'Somerton', 'South Albury', 'South Arm', 'South Ballina', 'South Bathurst', 'South Bowenfels', 'South Coogee', 'South Durras', 'South Golden Beach', 'South Grafton', 'South Granville', 'South Gundagai', 'South Gundurimba', 'South Guyra', 'South Hurstville', 'South Kempsey', 'South Lismore', 'South Littleton', 'South Maitland', 'South Maroota', 'South Murwillumbah', 'South Nowra', 'South Pambula', 'South Penrith', 'South Tamworth', 'South Turramurra', 'South Wentworthville', 'South West Rocks', 'South Windsor', 'South Wolumla', 'Southampton', 'Southgate', 'Speers Point', 'Speewa', 'Spencer', 'Spicers Creek', 'Spicketts Creek', 'Splitters Creek', 'Spring Creek', 'Spring Farm', 'Spring Flat', 'Spring Grove', 'Spring Hill', 'Spring Mountain', 'Spring Plains', 'Spring Ridge', 'Spring Terrace', 'Springdale', 'Springdale Heights', 'Springfield', 'Springrange', 'Springside', 'Springvale', 'Springwood', 'St Albans', 'St Andrews', 'St Clair', 'St Fillans', 'St George', 'St Georges Basin', 'St Helens Park', 'St Huberts Island', 'St Ives', 'St Ives Chase', 'St Johns Park', 'St Leonards', 'St Marys', 'St Peters', 'Stanborough', 'Stanbridge', 'Stanford Merthyr', 'Stanhope', 'Stanhope Gardens', 'Stanmore', 'Stannifer', 'Stannum', 'Stanwell Park', 'Stanwell Tops', 'State Mine Gully', 'Steam Plains', 'Steeple Flat', 'Stewarts Brook', 'Stewarts River', 'Stockinbingal', 'Stockrington', 'Stockton', 'Stockyard Creek', 'Stokers Siding', 'Stonehenge', 'Stonequarry', 'Stony Chute', 'Stony Creek', 'Stony Crossing', 'Stotts Creek', 'Stratford', 'Strathcedar', 'Stratheden', 'Strathfield', 'Strathfield South', 'Stroud', 'Stroud Hill', 'Stroud Road', 'Stuart Town', 'Stuarts Point', 'Stubbo', 'Stud Park', 'Suffolk Park', 'Sugarloaf', 'Summer Hill', 'Summer Hill Creek', 'Summer Island', 'Summerland Point', 'Sun Valley', 'Sunny Corner', 'Sunset Strip', 'Sunshine', 'Sunshine Bay', 'Suntop', 'Surf Beach', 'Surfside', 'Surry Hills', 'Sussex Inlet', 'Sutherland', 'Sutton', 'Sutton Forest', 'Swan Bay', 'Swan Creek', 'Swan Vale', 'Swanbrook', 'Swanhaven', 'Swans Crossing', 'Swansea', 'Swansea Heads', 'Sweetmans Creek', 'Sydenham', 'Sydney Olympic Park', 'Sylvania', 'Sylvania Waters', 'Tabbil Creek', 'Tabbimoble', 'Tabbita', 'Table Top', 'Tabulam', 'Tacoma', 'Tacoma South', 'Tahlee', 'Tahmoor', 'Talarm', 'Talawanta', 'Talbingo', 'Tallawang', 'Tallimba', 'Tallong', 'Tallowal', 'Tallowwood Ridge', 'Tallwood', 'Tallwoods Village', 'Talmalmo', 'Talofa', 'Taloumbi', 'Tamarama', 'Tamban', 'Tambar Springs', 'Tambaroora', 'Taminda', 'Tanglewood', 'Tanilba Bay', 'Tanja', 'Tannabar', 'Tannas Mount', 'Tantangara', 'Tantawangalo', 'Tantonan', 'Tapitallee', 'Tara', 'Taradale', 'Tarago', 'Taralga', 'Tarana', 'Tarban', 'Tarbuck Bay', 'Tarcutta', 'Taree', 'Taree South', 'Taren Point', 'Tarlo', 'Tarraganda', 'Tarrawanna', 'Tarriaro', 'Tarro', 'Tascott', 'Tatham', 'Tathra', 'Tatton', 'Taylors Arm', 'Taylors Beach', 'Taylors Flat', 'Tea Gardens', 'Telarah', 'Telegraph Point', 'Telopea', 'Temagog', 'Temora', 'Tempe', 'Ten Mile Hollow', 'Tenambit', 'Tenandra', 'Tennyson', 'Tennyson Point', 'Tenterden', 'Tenterfield', 'Teralba', 'Terania Creek', 'Terara', 'Teridgerie', 'Termeil', 'Terrabella', 'Terrace Creek', 'Terragon', 'Terramungamine', 'Terranora', 'Terreel', 'Terrey Hills', 'Terrigal', 'Terry Hie Hie', 'Teven', 'Tewinga', 'Texas', 'Thalgarrah', 'Tharbogang', 'The Angle', 'The Bight', 'The Branch', 'The Brothers', 'The Channon', 'The Devils Wilderness', 'The Entrance', 'The Entrance North', 'The Freshwater', 'The Gap', 'The Glen', 'The Gulf', 'The Hatch', 'The Hill', 'The Junction', 'The Lagoon', 'The Marra', 'The Meadows', 'The Oaks', 'The Pilliga', 'The Pinnacles', 'The Pocket', 'The Ponds', 'The Ridgeway', 'The Risk', 'The Rock', 'The Rocks', 'The Sandon', 'The Slopes', 'The Whiteman', 'Theresa Creek', 'Theresa Park', 'Thirldene', 'Thirlmere', 'Thirroul', 'Thora', 'Thornleigh', 'Thornton', 'Thrumster', 'Thuddungra', 'Thule', 'Thumb Creek', 'Thurgoona', 'Thyra', 'Tianjara', 'Tibbuc', 'Tibooburra', 'Tichborne', 'Tichular', 'Tighes Hill', 'Tilba Tilba', 'Tilbuster', 'Tilligerry Creek', 'Tilpa', 'Timbarra', 'Timbillica', 'Timbumburi', 'Timor', 'Tindarey', 'Tinderry', 'Tingha', 'Tingira Heights', 'Tinonee', 'Tinpot', 'Tintenbar', 'Tintinhull', 'Tiona', 'Tipperary', 'Tiri', 'Tirrannaville', 'Titaatee Creek', 'Tocal', 'Tocumwal', 'Tolland', 'Tolwong', 'Tomago', 'Tomakin', 'Tomalla', 'Tombong', 'Tomboye', 'Tomerong', 'Tomewin', 'Tomingley', 'Tomki', 'Toms Creek', 'Tonderburine', 'Tongarra', 'Toogong', 'Tooleybuc', 'Toolijooa', 'Tooloom', 'Tooloon', 'Tooma', 'Toongabbie', 'Toongi', 'Toonumbar', 'Tooranie', 'Tooraweenah', 'Toormina', 'Toorooka', 'Toothdale', 'Tootool', 'Toowoon Bay', 'Topi Topi', 'Toronto', 'Torrington', 'Torryburn', 'Totnes Valley', 'Tottenham', 'Touga', 'Toukley', 'Towallum', 'Towamba', 'Townsend', 'Towradgi', 'Towrang', 'Tralee', 'Trangie', 'Tregeagle', 'Tregear', 'Trenayr', 'Trentham Cliffs', 'Trewilga', 'Triamble', 'Triangle Flat', 'Trundle', 'Trungley Hall', 'Trunkey Creek', 'Tubbamurra', 'Tubbul', 'Tucabia', 'Tucki Tucki', 'Tuckombil', 'Tuckurimba', 'Tuena', 'Tuggerah', 'Tuggerawong', 'Tugrabakh', 'Tullakool', 'Tullamore', 'Tullarwalla', 'Tullera', 'Tullibigeal', 'Tullimbar', 'Tulloona', 'Tullymorgan', 'Tumbarumba', 'Tumbi Umbi', 'Tumblong', 'Tumumbul', 'Tumorrama', 'Tumut', 'Tumut Plains', 'Tuncester', 'Tuncurry', 'Tunglebung', 'Tuntable Creek', 'Tuppal', 'Tura Beach', 'Turill', 'Turlinjah', 'Turners Flat', 'Turondale', 'Tuross', 'Tuross Head', 'Turramurra', 'Turrawan', 'Turrella', 'Turvey Park', 'Tweed Heads South', 'Tweed Heads West', 'Twelve Mile', 'Twelve Mile Creek', 'Twelve Mile Peg', 'Twenty Forests', 'Twin Rivers', 'Two Mile Flat', 'Tyagarah', 'Tyalgum', 'Tyalgum Creek', 'Tygalgah', 'Tyndale', 'Tyringham', 'Uarbry', 'Uki', 'Ulamambri', 'Ulan', 'Ulladulla', 'Ulmarra', 'Ulong', 'Ultimo', 'Umina Beach', 'Unanderra', 'Underbank', 'Undercliffe', 'Ungarie', 'Unumgar', 'Upper Allyn', 'Upper Bingara', 'Upper Burringbar', 'Upper Bylong', 'Upper Colo', 'Upper Coopers Creek', 'Upper Copmanhurst', 'Upper Corindi', 'Upper Crystal Creek', 'Upper Dartbrook', 'Upper Duck Creek', 'Upper Duroby', 'Upper Eden Creek', 'Upper Fine Flower', 'Upper Growee', 'Upper Horseshoe Creek', 'Upper Horton', 'Upper Kangaroo River', 'Upper Kangaroo Valley', 'Upper Karuah River', 'Upper Lansdowne', 'Upper Macdonald', 'Upper Main Arm', 'Upper Mangrove', 'Upper Manilla', 'Upper Mongogarie', 'Upper Myall', 'Upper Nile', 'Upper Orara', 'Upper Pappinbarra', 'Upper Rollands Plains', 'Upper Rouchel', 'Upper Taylors Arm', 'Upper Tooloom', 'Upper Turon', 'Upper Wilsons Creek', 'Upsalls Creek', 'Uralba', 'Uralla', 'Urana', 'Urangeline', 'Urangeline East', 'Uranquinty', 'Urawilkie', 'Urbenville', 'Uriarra', 'Urila', 'Urliup', 'Urunga', 'Utungun', 'Vacy', 'Vale Of Clwydd', 'Valentine', 'Valery', 'Valla', 'Valla Beach', 'Valley Heights', 'Varroville', 'Vaucluse', 'Verges Creek', 'Verona', 'Villawood', 'Vincentia', 'Vineyard', 'Violet Hill', 'Vittoria', 'Voyager Point'],
      'Victoria': ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo', 'Shepparton', 'Mildura', 'Warrnambool', 'Traralgon', 'Horsham', 'Wodonga', 'Sale', 'Swan Hill', 'Wangaratta'],
      'Queensland': ['Brisbane', 'Gold Coast', 'Sunshine Coast', 'Townsville', 'Cairns', 'Toowoomba', 'Mackay', 'Rockhampton', 'Bundaberg', 'Hervey Bay', 'Gladstone', 'Mount Isa'],
      'Western Australia': ['Perth', 'Fremantle', 'Mandurah', 'Bunbury', 'Geraldton', 'Kalgoorlie', 'Broome', 'Port Hedland', 'Albany', 'Busselton', 'Esperance', 'Karratha'],
      'South Australia': ['Adelaide', 'Mount Gambier', 'Whyalla', 'Port Augusta', 'Port Pirie', 'Murray Bridge', 'Port Lincoln', 'Victor Harbor'],
      'Tasmania': ['Hobart', 'Launceston', 'Devonport', 'Burnie'],
      'Northern Territory': ['Darwin', 'Alice Springs', 'Katherine', 'Nhulunbuy', 'Acacia Hills', 'Adelaide River', 'Alawa', 'Ali Curung', 'Alice Springs', 'Alpurrurulam', 'Alyangula', 'Amoonguna', 'Ampilatwatja', 'Anatye', 'Angurugu', 'Anindilyakwa', 'Anmatjere', 'Anula', 'Araluen', 'Archer', 'Areyonga', 'Arnold', 'Arumbera', 'Atitjere', 'Baines', 'Bakewell', 'Barunga', 'Batchelor', 'Bayview', 'Bees Creek', 'Bellamack', 'Belyuen', 'Berrimah', 'Berry Springs', 'Beswick', 'Beswick Creek', 'Binjari', 'Birdum', 'Black Jungle', 'Blackmore', 'Borroloola', 'Bradshaw', 'Braitling', 'Brinkin', 'Buchanan', 'Buffalo Creek', 'Bulman Weemol', 'Burrundie', 'Burt Plain', 'Bynoe', 'Bynoe Harbour', 'Calvert', 'Camp Creek', 'Canteen Creek', 'Casuarina', 'Channel Island', 'Charles Darwin', 'Charlotte', 'Chilla Well', 'Ciccone', 'Claravale', 'Cobourg', 'Coconut Grove', 'Collett Creek', 'Connellan', 'Coolalinga', 'Coomalie Creek', 'Coonawarra', 'Cossack', 'Costello', 'Cox Peninsula', 'Creswell', 'Daguragu', 'Daly', 'Daly River', 'Daly Waters', 'Darwin City', 'Darwin River', 'Darwin River Dam', 'Davenport', 'Delamere', 'Desert Springs', 'Douglas-Daly', 'Driver', 'Dundee Beach', 'Dundee Downs', 'Dundee Forest', 'Durack', 'East Arm', 'East Arnhem', 'East Point', 'East Side', 'Eaton', 'Edith', 'Elliott', 'Elrundie', 'Elsey', 'Emungalan', 'Engawala', 'Eva Valley', 'Fannie Bay', 'Farrar', 'Finke', 'Finniss Valley', 'Florina', 'Fly Creek', 'Flying Fox', 'Flynn', 'Freds Pass', 'Galiwinku', 'Gapuwiyak', 'Ghan', 'Gillen', 'Girraween', 'Glyde Point', 'Gray', 'Gregory', 'Gulung Mardrulk', 'Gunbalanya', 'Gunn', 'Gunn Point', 'Gunyangara', 'Gurindji', 'Haasts Bluff', 'Hale', 'Hart', 'Herbert', 'Hermannsburg', 'Hidden Valley', 'Holmes', 'Holtze', 'Hotham', 'Howard Springs', 'Hugh', 'Hughes', 'Humpty Doo', 'Ilparpa', 'Imanpa', 'Irlpme', 'Jabiru', 'Jilkminggan', 'Jingili', 'Johnston', 'Kakadu', 'Kalkarindji', 'Kaltukatjara', 'Karama', 'Katherine', 'Katherine East', 'Katherine South', 'Kilgariff', 'Kintore', 'Knuckey Lagoon', 'Koolpinyah', 'Kunparrka', 'Lajamanu', 'Lake Bennett', 'Lake Mackay', 'Lambells Lagoon', 'Lansdowne', 'Laramba', 'Larapinta', 'Larrakeyah', 'Larrimah', 'Leanyer', 'Lee Point', 'Limmen', 'Litchfield Park', 'Livingstone', 'Lloyd Creek', 'Ludmilla', 'Lyons', 'Malak', 'Manbulloo', 'Mandorah', 'Maningrida', 'Manton', 'Maranunga', 'Margaret River', 'Marlow Lagoon', 'Marrakai', 'Marrara', 'Mataranka', 'McArthur', 'McMinns Lagoon', 'Mereenie', 'Micket Creek', 'Middle Point', 'Milikapiti', 'Milingimbi', 'Millner', 'Milyakburra', 'Miniyeri', 'Minjilang', 'Mitchell', 'Moil', 'Moulden', 'Mount Bundey', 'Mount Johns', 'Mount Liebig', 'Mount Zeil', 'Muirhead', 'Murrumujuk', 'Mutitjulu', 'Nakara', 'Namatjira', 'Nauiyu', 'Nemarluk', 'Newcastle Waters', 'Nganmarriyanga', 'Ngukurr', 'Nhulunbuy', 'Nicholson', 'Nightcliff', 'Nitmiluk', 'Noonamah', 'Numbulwar', 'Numburindi', 'Nyirripi', 'Palmerston City', 'Pamayu', 'Papunya', 'Parap', 'Pellew Islands', 'Peppimenarti', 'Petermann', 'Pigeon Hole', 'Pine Creek', 'Pinelands', 'Pirlangimpi', 'Point Stuart', 'Rakula', 'Ramingining', 'Ranken', 'Rapid Creek', 'Robin Falls', 'Robinson River', 'Rosebery', 'Ross', 'Rum Jungle', 'Sadadeen', 'Sandover', 'Santa Teresa', 'Shoal Bay', 'Simpson', 'Southport', 'Stapleton', 'Stuart', 'Stuart Park', 'Sturt Plateau', 'Tablelands', 'Tanami', 'Tanami East', 'Tara', 'Tennant Creek', 'Thamarrurr', 'The Gap', 'The Gardens', 'The Narrows', 'Ti Tree', 'Timber Creek', 'Tindal', 'Tipperary', 'Titjikala', 'Tivendale', 'Tiwi', 'Tiwi Islands', 'Top Springs', 'Tortilla Flats', 'Tumbling Waters', 'Umbakumba', 'Undoolya', 'Uralla', 'Van Diemen Gulf', 'Venn', 'Vernon Islands', 'Victoria River', 'Virginia', 'Wadeye', 'Wagait Beach', 'Wagaman', 'Wak Wak', 'Wallace Rockhole', 'Wanguri', 'Warruwi', 'Warumungu', 'Weddell', 'West Arnhem', 'White Gums', 'Wickham', 'Willowra', 'Wilora', 'Wilton', 'Winnellie', 'Wishart', 'Woodroffe', 'Woolner', 'Wulagi', 'Wurrumiyanga', 'Wutunugurra', 'Yarralin', 'Yarrawonga', 'Yirrkala', 'Yuelamu', 'Yuendumu', 'Yulara', 'Zuccoli'],
      'Australian Capital Territory': ['Canberra', 'Acton', 'Ainslie', 'Amaroo', 'Aranda', 'Banks', 'Barton', 'Beard', 'Belconnen', 'Bonner', 'Bonython', 'Braddon', 'Bruce', 'Calwell', 'Campbell', 'Canberra Airport', 'Capital Hill', 'Casey', 'Chapman', 'Charnwood', 'Chifley', 'Chisholm', 'City', 'Conder', 'Cook', 'Coombs', 'Crace', 'Curtin', 'Deakin', 'Denman Prospect', 'Dickson', 'Downer', 'Duffy', 'Dunlop', 'Evatt', 'Fadden', 'Farrer', 'Fisher', 'Florey', 'Flynn', 'Forde', 'Forrest', 'Franklin', 'Fraser', 'Fyshwick', 'Garran', 'Gilmore', 'Giralang', 'Gordon', 'Gowrie', 'Greenway', 'Griffith', 'Gungahlin', 'Hackett', 'Hall', 'Harrison', 'Hawker', 'Higgins', 'Holder', 'Holt', 'Hughes', 'Hume', 'Isaacs', 'Isabella Plains', 'Jacka', 'Kaleen', 'Kambah', 'Kingston', 'Latham', 'Lawson', 'Lyneham', 'Lyons', 'Macarthur', 'Macgregor', 'Macquarie', 'Mawson', 'McKellar', 'Melba', 'Mitchell', 'Molonglo', 'Monash', 'Moncrieff', 'Narrabundah', 'Ngunnawal', 'Nicholls', 'O\'Connor', 'O\'Malley', 'Oaks Estate', 'Oxley', 'Page', 'Palmerston', 'Parkes', 'Pearce', 'Phillip', 'Pialligo', 'Red Hill', 'Reid', 'Richardson', 'Rivett', 'Russell', 'Scullin', 'Spence', 'Stirling', 'Symonston', 'Tharwa', 'Theodore', 'Throsby', 'Torrens', 'Turner', 'Uriarra Village', 'Wanniassa', 'Waramanga', 'Watson', 'Weetangera', 'Weston', 'Wright', 'Yarralumla']
    },
    currencySymbol: 'A$',
    sheetName: 'Australia'
  }
};

// Global variable for current country
let currentCountry = 'Australia';

document.addEventListener('DOMContentLoaded', function () {
  // Configuration
  const config = {
    spreadsheetId: '1c4dUNUiz0TQ3ivYjoIL2-T-1QDqkc-xknBdLg79oFcU',
    apiKey: 'AIzaSyBy-KF-JG8TdrymwPg7n81AjmSzZGKteDQ',
    sheetName: 'Australia', // Default sheet
    range: 'A1:M1000' // Expanded range to include more rows and the Program_Name column
  };

  const fieldsOfStudy = ['Computer Science', 'Business', 'Engineering',
    'Medicine', 'Law', 'Arts', 'Psychology', 'Economics',
    'Architecture', 'Education', 'Biology', 'Chemistry', 'Accounting & Finance'];

  // Initialize the page
  populateDropdowns(currentCountry);
  testConnection();

  // Handle country change
  document.getElementById('country').addEventListener('change', async function (e) {
    currentCountry = e.target.value;
    config.sheetName = countryConfigs[currentCountry].sheetName;
    populateDropdowns(currentCountry);
    updateCurrencyLabels(currentCountry);
    await populateUniversityDropdown(currentCountry);
    // Clear previous results and dropdowns
    document.querySelector('#resultsTable tbody').innerHTML = '';
    document.getElementById('course').innerHTML = '<option value="">Select Course</option>';
  });

  // Populate dropdowns
  function populateDropdowns(country) {
    setupLocationDropdown(country);
    setupFieldCheckboxes();
    updateFeeRangeOptions(country);
  }

  function setupLocationDropdown(country) {
    const selectedState = document.getElementById('state').value;
    const selectedUniversity = document.getElementById('university').value;
    const selectedCourse = document.getElementById('course').value;
    const selectedDegree = document.getElementById('degree').value;

    // Get the container that previously held checkboxes
    const locationContainer = document.querySelector('.checkbox-options');

    // Create a new select element
    const citySelect = document.createElement('select');
    citySelect.id = 'citySelect';
    citySelect.className = 'form-control';

    // Add default option
    citySelect.innerHTML = '<option value="">Select City</option>';

    // Get available cities based on filters
    let availableCities = [];

    if (selectedState && countryConfigs[country].states[selectedState]) {
      // Get all cities for the selected state
      const stateCities = countryConfigs[country].states[selectedState];

      // Filter cities based on university and course selection
      if (selectedUniversity) {
        const relevantUniversities = window.universityData.filter(uni => {
          const matchesUniversity = uni.University_Name === selectedUniversity;
          const matchesCourse = !selectedCourse || uni.Course === selectedCourse;
          const matchesDegree = !selectedDegree || selectedDegree.toLowerCase() === 'all' || degreesMatch(uni.Degree, selectedDegree);
          return matchesUniversity && matchesCourse && matchesDegree;
        });

        const citiesSet = new Set();
        relevantUniversities.forEach(uni => {
          if (uni.Location) {
            const locations = uni.Location.split(/,\s*/).map(loc => loc.trim());
            locations.forEach(loc => {
              if (stateCities.includes(loc)) {
                citiesSet.add(loc);
              }
            });
          }
        });
        availableCities = Array.from(citiesSet);
      } else {
        availableCities = stateCities;
      }
    }

    // Sort cities alphabetically
    availableCities.sort((a, b) => a.localeCompare(b));

    // Add cities to dropdown
    availableCities.forEach(city => {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });

    // Clear the container and add the new dropdown
    locationContainer.innerHTML = '';
    locationContainer.appendChild(citySelect);

    // Add change event listener to the city select
    citySelect.addEventListener('change', function () {
      console.log('Selected city:', this.value);
    });
  }

  function getAvailableLocations(country, selectedState) {
    const selectedUniversity = document.getElementById('university').value;
    const selectedCourse = document.getElementById('course').value;
    const selectedDegree = document.getElementById('degree').value;

    // Get all cities for the selected state
    let stateCities = selectedState ? countryConfigs[country].states[selectedState] : [];

    // If no state is selected, get all cities from all states
    if (!selectedState) {
      stateCities = Array.from(new Set(Object.values(countryConfigs[country].states).flat())); // Remove duplicates
    }

    // If no university is selected but degree is selected
    if (!selectedUniversity && selectedDegree) {
      const filteredLocations = new Set();
      const relevantData = universityData.filter(uni => degreesMatch(uni.Degree, selectedDegree));

      relevantData.forEach(uni => {
        const locations = uni.Location.split(/,\s*/).map(loc => loc.trim());
        locations.forEach(loc => {
          if (stateCities.includes(loc)) {
            filteredLocations.add(loc);
          }
        });
      });

      return Array.from(filteredLocations).sort((a, b) => a.localeCompare(b)); // Ensure proper alphabetical sorting
    }

    // If no university or degree is selected, return all cities for the selected state
    if (!selectedUniversity || !selectedDegree) {
      return stateCities.sort((a, b) => a.localeCompare(b)); // Ensure proper alphabetical sorting
    }

    // If university is selected but no course
    if (selectedUniversity && !selectedCourse) {
      const filteredLocations = new Set();
      universityData
        .filter(uni =>
          uni.University_Name === selectedUniversity &&
          (!selectedDegree || degreesMatch(uni.Degree, selectedDegree))
        )
        .forEach(uni => {
          const locations = uni.Location.split(/,\s*/).map(loc => loc.trim());
          locations.forEach(loc => {
            if (stateCities.includes(loc)) {
              filteredLocations.add(loc);
            }
          });
        });

      return Array.from(filteredLocations).sort((a, b) => a.localeCompare(b)); // Ensure proper alphabetical sorting
    }

    // If both university and course are selected
    const filteredLocations = new Set();
    const data = universityData.filter(uni =>
      uni.University_Name === selectedUniversity &&
      uni.Course === selectedCourse &&
      (!selectedDegree || degreesMatch(uni.Degree, selectedDegree))
    );

    data.forEach(uni => {
      const locations = uni.Location.split(/,\s*/).map(loc => loc.trim());
      locations.forEach(loc => {
        if (stateCities.includes(loc)) {
          filteredLocations.add(loc);
        }
      });
    });

    return Array.from(filteredLocations).sort((a, b) => a.localeCompare(b)); // Ensure proper alphabetical sorting
  }

  function initializeDropdownListeners(selectBox, checkboxList, searchInput, locationContainer, selectedText) {
    // Toggle dropdown
    selectBox.addEventListener('click', function (e) {
      e.stopPropagation();
      const isActive = checkboxList.classList.contains('show');
      checkboxList.classList.toggle('show');
      selectBox.classList.toggle('active');

      if (!isActive) {
        searchInput.focus();
      }
    });

    // Handle search
    searchInput.addEventListener('input', function (e) {
      const searchTerm = e.target.value.toLowerCase();
      const labels = locationContainer.querySelectorAll('label');

      labels.forEach(label => {
        const text = label.textContent.toLowerCase();
        label.style.display = text.includes(searchTerm) ? '' : 'none';
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
      if (!selectBox.contains(e.target) && !checkboxList.contains(e.target)) {
        checkboxList.classList.remove('show');
        selectBox.classList.remove('active');
      }
    });

    // Handle checkbox changes
    const checkboxes = locationContainer.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function () {
        updateSelectedLocations(checkboxes, selectedText);
      });
    });
  }

  function updateSelectedLocations(checkboxes, selectedText) {
    const selectedLocations = Array.from(checkboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    if (selectedLocations.length === 0) {
      selectedText.textContent = 'Select Locations';
    } else if (selectedLocations.length <= 2) {
      selectedText.textContent = selectedLocations.join(', ');
    } else {
      selectedText.textContent = `${selectedLocations.length} locations selected`;
    }
  }

  function setupFieldCheckboxes() {
    const fieldContainer = document.getElementById('fieldCheckboxes');
    fieldContainer.innerHTML = ''; // Clear existing checkboxes
    fieldsOfStudy.forEach(field => {
      const label = document.createElement('label');
      label.innerHTML = `<input type="checkbox" name="field" value="${field}"> ${field}`;
      fieldContainer.appendChild(label);
    });
  }

  function updateFeeRangeOptions(country) {
    const feeSelect = document.getElementById('fee');
    const symbol = countryConfigs[country].currencySymbol;
    feeSelect.innerHTML = `
      <option value="">Select Range</option>
      <option value="5000-10000">${symbol}5,000-${symbol}10,000</option>
      <option value="10000-15000">${symbol}10,000-${symbol}15,000</option>
      <option value="15000-20000">${symbol}15,000-${symbol}20,000</option>
      <option value="20000-25000">${symbol}20,000-${symbol}25,000</option>
      <option value="25000-30000">${symbol}25,000-${symbol}30,000</option>
      <option value="30000+">${symbol}30,000+</option>
    `;
  }

  function updateCurrencyLabels(country) {
    const symbol = countryConfigs[country].currencySymbol;
    document.querySelector('label[for="fee"]').textContent = `Fee Range (${symbol}):`;
  }

  // Update formatCurrency function to handle different currencies
  function formatCurrency(value, country = currentCountry) {
    if (!value) return 'N/A';
    const symbol = countryConfigs[country].currencySymbol;
    const num = parseFloat(value.replace(/[^\d.]/g, ''));
    return isNaN(num) ? value : symbol + num.toLocaleString('en-GB');
  }

  // Test the connection on load
  async function testConnection() {
    try {
      const data = await fetchDataFromGoogleSheets(config);
      if (data && data.length > 0) {
        console.log('Test data received:', data.slice(0, 5));
        displayFilteredResults(data.slice(0, 5), {}); // Pass empty filters for initial display
      } else {
        console.error('Data loaded but empty');
        displayError(new Error('Data loaded but empty'));
      }
    } catch (error) {
      console.error('Test connection error:', error);
      displayError(error);
    }
  }

  // Fetch data from Google Sheets by using google API via Google cloud console
  async function fetchDataFromGoogleSheets({ spreadsheetId, apiKey, sheetName, range }) {
    console.log('Fetching data from sheet:', sheetName);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!${range}?key=${apiKey}`;

    try {
      console.log('Fetching from URL:', url);
      const response = await fetch(url);
      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }

      const data = await response.json();
      console.log('Raw data received:', data);

      if (!data.values) {
        console.error('No values in response:', data);
        throw new Error('No data values in response');
      }

      if (data.values.length === 0) {
        console.error('Empty values array in response');
        throw new Error('No data found in the sheet');
      }

      // Transform the data into an array of objects
      const headers = data.values[0].map(header =>
        header.trim()
          .replace(/ /g, '_')
          .replace(/[()]/g, '')
      );
      console.log('Processed headers:', headers);

      const processedData = data.values.slice(1).map(row => {
        const obj = {};
        headers.forEach((header, i) => {
          obj[header] = (row[i] || '').trim() || 'N/A';
        });
        return obj;
      });

      console.log('Processed data sample:', processedData.slice(0, 2));
      return processedData;

    } catch (error) {
      console.error('Error fetching data:', error);
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }

  // Display results in the table
  function displayFilteredResults(universities, activeFilters) {
    console.log('Displaying filtered results:', universities);
    console.log('Active filters:', activeFilters);

    const tableBody = document.querySelector('#resultsTable tbody');
    if (!tableBody) {
      console.error('Table body element not found');
      return;
    }

    tableBody.innerHTML = '';

    if (!universities || universities.length === 0) {
      console.log('No universities to display');
      tableBody.innerHTML = `
        <tr>
          <td colspan="13" class="no-results">
            <div class="no-results-content">
              <h3>No universities match your selection</h3>
              <p>Try adjusting your filters:</p>
              <ul>
                ${activeFilters.locations?.length ? '<li>Choose different locations</li>' : ''}
                ${activeFilters.englishTests?.length ? '<li>Select different English tests</li>' : ''}
                ${activeFilters.cgpa ? '<li>Widen your score range</li>' : ''}
                ${activeFilters.fields?.length ? '<li>Choose different fields of study</li>' : ''}
                ${activeFilters.fee ? '<li>Adjust your fee range</li>' : ''}
              </ul>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    try {
      universities.forEach((uni, index) => {
        console.log(`Processing university ${index + 1}:`, uni);
        const row = document.createElement('tr');
        row.style.animationDelay = `${index * 0.05}s`;
        row.classList.add('animate__animated', 'animate__fadeInUp');

        // Ensure all required fields are present
        const safeUni = {
          University_Name: uni.University_Name || 'N/A',
          Location: uni.Location || 'N/A',
          Degree: uni.Degree || 'N/A',
          Course: uni.Course || 'N/A',
          Intake: uni.Intake || 'N/A',
          Percentage_CGPA: uni.Percentage_CGPA || 'N/A',
          English_Test: uni.English_Test || 'N/A',
          Field_of_Study: uni.Field_of_Study || 'N/A',
          Fee: uni.Fee || 'N/A',
          Initial_Deposit: uni.Initial_Deposit || 'N/A',
          Other_Remarks: uni.Other_Remarks || 'N/A',
          Course_link: uni.Course_link || 'N/A'
        };

        // Create cell content with proper formatting
        const otherRemarks = safeUni.Other_Remarks !== 'N/A' ?
          `<div class="remarks-content">${escapeHtml(safeUni.Other_Remarks)}</div>` : 'N/A';

        const courseLink = safeUni.Course_link !== 'N/A' ?
          `<a href="${escapeHtml(safeUni.Course_link)}" 
              target="_blank" 
              class="course-link" 
              data-url="${escapeHtml(safeUni.Course_link)}" 
              title="${escapeHtml(safeUni.Course_link)}">
            <i class="fas fa-external-link-alt"></i> View Course
           </a>` : 'N/A';

        row.innerHTML = `
          <td>${escapeHtml(safeUni.University_Name)}</td>
          <td>${escapeHtml(safeUni.Location)}</td>
          <td>${escapeHtml(safeUni.Degree)}</td>
          <td>${escapeHtml(safeUni.Course)}</td>
          <td>${escapeHtml(safeUni.Intake)}</td>
          <td>${formatScore(safeUni.Percentage_CGPA, activeFilters.cgpa)}</td>
          <td>${formatListItems(safeUni.English_Test, activeFilters.englishTests, /[,\s\/]|and|or/, true)}</td>
          <td>${formatListItems(safeUni.Field_of_Study, activeFilters.fields)}</td>
          <td>${formatCurrency(safeUni.Fee)}</td>
          <td>${formatCurrency(safeUni.Initial_Deposit)}</td>
          <td class="remarks-cell">${otherRemarks}</td>
          <td class="course-link-cell" data-url="${escapeHtml(safeUni.Course_link)}">${courseLink}</td>
        `;

        tableBody.appendChild(row);
      });

      console.log('Finished displaying universities');
    } catch (error) {
      console.error('Error displaying results:', error);
      tableBody.innerHTML = `
        <tr>
          <td colspan="13" style="text-align: center; color: red;">
            Error displaying results. Please try again.
          </td>
        </tr>
      `;
    }
  }


  // Helper functions
  function escapeHtml(text) {
    return text ? text.toString().replace(/</g, '&lt;').replace(/>/g, '&gt;') : 'N/A';
  }

  // Function to filter English test results based on selection
  function filterEnglishTest(testString, selectedTests) {
    if (!testString || testString === 'N/A') return 'N/A';

    // If no tests selected, return all tests
    if (!selectedTests || selectedTests.length === 0) {
      return testString;
    }

    // Split the test string by common separators and clean up
    const allTests = testString.split(/[,\/]|\s+(?:and|or)\s+/)
      .map(test => test.trim())
      .filter(test => test);

    // Create regex patterns for each test type with more flexible matching
    const patterns = {
      'IELTS': /(?:IELTS|ielts)(?:[:\s-]*(?:overall)?[:\s-]*)?([\d.]+)?/i,
      'PTE': /(?:PTE|pte)(?:[:\s-]*(?:overall)?[:\s-]*)?([\d.]+)?/i,
      'TOEFL': /(?:TOEFL|toefl)(?:[:\s-]*(?:overall)?[:\s-]*)?([\d.]+)?/i,
      'Duolingo': /(?:Duolingo|DET)(?:[:\s-]*(?:overall)?[:\s-]*)?([\d.]+)?/i,
      'Cambridge': /(?:Cambridge|CAE|FCE)(?:[:\s-]*)?((?:[A-C][12]?)|(?:[\d.]+))?/i,
      'Lang Cert': /(?:Lang[\s-]*Cert|LangCert)(?:[:\s-]*(?:overall)?[:\s-]*)?([\d.]+|[A-C][12]?)?/i,
      'Oxford': /(?:Oxford)(?:[:\s-]*(?:overall)?[:\s-]*)?([\d.]+|[A-C][12]?)?/i,
      'MOI': /(?:MOI|Medium\s+of\s+Instruction)/i
    };

    // Filter and match tests with better logging
    const matchingTests = [];

    // First try to match in the full string for each selected test
    selectedTests.forEach(selected => {
      const pattern = patterns[selected];
      if (!pattern) return;

      // For MOI, just check if the test contains the term
      if (selected === 'MOI') {
        if (pattern.test(testString)) {
          matchingTests.push('MOI');
          return;
        }
      }

      // For other tests, try to match in the full string first
      const match = testString.match(pattern);
      if (match) {
        const score = match[1] ? `: ${match[1]}` : '';
        matchingTests.push(`${selected}${score}`);
        console.log(`Full string match for ${selected} test:`, `${selected}${score}`);
      }
    });

    // If no matches found in full string, try individual tests
    if (matchingTests.length === 0) {
      allTests.forEach(test => {
        selectedTests.forEach(selected => {
          const pattern = patterns[selected];
          if (!pattern) return;

          if (selected === 'MOI') {
            if (pattern.test(test)) {
              matchingTests.push('MOI');
            }
            return;
          }

          // Try to match with more flexible pattern
          if (test.toLowerCase().includes(selected.toLowerCase())) {
            const match = test.match(/[\d.]+|[A-C][12]?/i);
            const score = match ? `: ${match[0]}` : '';
            matchingTests.push(`${selected}${score}`);
            console.log(`Matched ${selected} test with score:`, `${selected}${score}`);
          }
        });
      });
    }

    // Remove duplicates and format the result
    const uniqueTests = [...new Set(matchingTests)];
    return uniqueTests.length > 0 ? uniqueTests.join(', ') : 'N/A';
  }

  // Update formatListItems to better handle test display
  function formatListItems(value, filterItems, separator = /,\s*/, isEnglishTest = false) {
    if (!value || value === 'N/A') return 'N/A';

    // If no filters selected and it's English test, return all tests
    if ((!filterItems || filterItems.length === 0) && isEnglishTest) {
      return escapeHtml(value);
    }

    // If no filters selected for non-English test items, return as is
    if (!filterItems || filterItems.length === 0) {
      return escapeHtml(value);
    }

    if (isEnglishTest) {
      // Filter English tests first
      const filteredValue = filterEnglishTest(value, filterItems);
      if (filteredValue === 'N/A') return 'N/A';

      // Format the filtered value with better highlighting
      return filteredValue.split(/,\s*/).map(item => {
        const isMatch = filterItems.some(f =>
          item.toLowerCase().includes(f.toLowerCase())
        );
        return isMatch ?
          `<span class="filter-match">${escapeHtml(item.trim())}</span>` :
          escapeHtml(item.trim());
      }).join(', ');
    }

    // Handle other list items normally
    return value.split(separator)
      .map(item => {
        const isMatch = filterItems.some(f =>
          f.toLowerCase() === item.trim().toLowerCase()
        );
        return isMatch ?
          `<span class="filter-match">${escapeHtml(item.trim())}</span>` :
          escapeHtml(item.trim());
      })
      .join(', ');
  }

  function formatScore(value, rangeFilter) {
    if (!value) return 'N/A';

    const numericValue = parseFloat(value.replace(/[^\d.]/g, ''));
    if (isNaN(numericValue)) return escapeHtml(value);

    let displayValue = value.includes('%') ?
      `${numericValue}%` :
      `${numericValue.toFixed(1)} CGPA`;

    if (rangeFilter) {
      const [min, max] = rangeFilter.split('-').map(parseFloat);
      if (numericValue >= min && numericValue <= max) {
        displayValue = `<span class="filter-match">${displayValue}</span>`;
      }
    }

    return displayValue;
  }

  // Display error message
  function displayError(error) {
    console.error('Error:', error);
    const tableBody = document.querySelector('#resultsTable tbody');
    tableBody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align: center; color: red;">
                    
                    No data Available. Kindly select filter.
                </td>
            </tr>
        `;
  }

  // Form submission handler
  document.getElementById('profileForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Searching...';

    try {
      const rawData = await fetchDataFromGoogleSheets({
        spreadsheetId: config.spreadsheetId,
        apiKey: config.apiKey,
        sheetName: countryConfigs[currentCountry].sheetName,
        range: config.range
      });

      if (!rawData || rawData.length === 0) {
        throw new Error("No university data available");
      }

      const filters = {
        university: document.getElementById('university').value,
        course: document.getElementById('course').value,
        degree: document.getElementById('degree').value,
        englishTests: Array.from(document.querySelectorAll('input[name="englishTest"]:checked'))
          .map(el => el.value),
        locations: Array.from(document.querySelectorAll('input[name="location"]:checked'))
          .map(el => el.value),
        cgpa: document.getElementById('cgpa').value,
        fields: Array.from(document.querySelectorAll('input[name="field"]:checked'))
          .map(el => el.value),
        fee: document.getElementById('fee').value
      };

      console.log("Active filters:", filters);
      const filteredData = filterUniversities(rawData, filters);
      console.log(`Found ${filteredData.length} matching records`);
      displayFilteredResults(filteredData, filters);

    } catch (error) {
      console.error("Search error:", error);
      displayError(error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Find Universities';
    }
  });

  // Filter universities
  function filterUniversities(data, criteria) {
    return data.filter(university => {
      // Location filter
      if (criteria.locations && criteria.locations.length > 0) {
        const uniLocations = university.Location.toLowerCase().split(/,\s*/).map(loc => loc.trim());
        if (!criteria.locations.some(loc => uniLocations.includes(loc.toLowerCase().trim()))) {
          return false;
        }
      }

      // English Test filter
      if (criteria.englishTests && criteria.englishTests.length > 0) {
        const filteredTests = filterEnglishTest(university.English_Test, criteria.englishTests);
        if (filteredTests === 'N/A') {
          return false;
        }
      }

      // Fee filter with exact matching
      if (criteria.fee && criteria.fee !== "") {
        const [minFee, maxFee] = criteria.fee.split('-').map(f =>
          f === '+' ? Infinity : parseInt(f.replace(/[^0-9]/g, ''))
        );
        const uniFee = parseInt(university.Fee.replace(/[^0-9]/g, ''));

        if (isNaN(uniFee) || uniFee < minFee || (maxFee !== Infinity && uniFee > maxFee)) {
          return false;
        }
      }

      // Field of Study filter
      if (criteria.fields && criteria.fields.length > 0) {
        const uniFields = university.Field_of_Study.toLowerCase().split(/,\s*/).map(field => field.trim());
        if (!criteria.fields.some(field => uniFields.includes(field.toLowerCase()))) {
          return false;
        }
      }

      // CGPA/Percentage filter
      if (criteria.cgpa && criteria.cgpa !== "") {
        const [minScore, maxScore] = criteria.cgpa.split('-').map(parseFloat);
        const uniScore = parseFloat(university.Percentage_CGPA.replace(/[^\d.]/g, ''));

        if (isNaN(uniScore) || uniScore < minScore || uniScore > maxScore) {
          return false;
        }
      }

      // University filter
      if (criteria.university && criteria.university !== "") {
        if (university.University_Name !== criteria.university) return false;
      }

      // Course filter
      if (criteria.course && criteria.course !== "") {
        if (university.Course !== criteria.course) return false;
      }

      // Degree filter
      if (criteria.degree && criteria.degree !== "" && criteria.degree !== "All") {
        if (!degreesMatch(university.Degree, criteria.degree)) return false;
      }

      return true;
    });
  }

  // Global variables to store university and course data
  window.universityData = [];
  let currentUniversities = [];

  // Function to populate university dropdown based on country selection
  async function populateUniversityDropdown(country) {
    const universitySelect = document.getElementById('university');
    const selectedDegree = document.getElementById('degree').value;
    universitySelect.innerHTML = '<option value="">Select University/College</option>';

    try {
      const data = await fetchDataFromGoogleSheets({
        spreadsheetId: config.spreadsheetId,
        apiKey: config.apiKey,
        sheetName: countryConfigs[country].sheetName,
        range: config.range
      });

      // Store all data for later use
      window.universityData = data;

      // Filter universities based on degree if selected and not "All"
      let filteredData = data;
      if (selectedDegree && selectedDegree.toLowerCase() !== 'all') {
        filteredData = data.filter(item => degreesMatch(item.Degree, selectedDegree));
      }

      // Get unique universities from filtered data
      const universities = [...new Set(filteredData.map(item => item.University_Name))].sort();
      currentUniversities = universities;

      // Add universities to dropdown
      universities.forEach(uni => {
        const option = document.createElement('option');
        option.value = uni;
        option.textContent = uni;
        universitySelect.appendChild(option);
      });

      // Update state dropdown after loading universities
      updateStateDropdown(country);

      console.log(`Populated ${universities.length} universities for ${country}${selectedDegree ? ` with degree ${selectedDegree}` : ''}`);
    } catch (error) {
      console.error('Error populating universities:', error);
    }
  }

  // Function to check if degrees match
  function degreesMatch(courseDegree, selectedDegree) {
    if (!courseDegree || !selectedDegree) return false;

    // If "All" is selected, return true for all degrees
    if (selectedDegree.toLowerCase() === 'all') return true;

    courseDegree = courseDegree.toLowerCase().trim();
    selectedDegree = selectedDegree.toLowerCase().trim();

    // Direct match
    if (courseDegree === selectedDegree) return true;

    // Handle Foundation Year
    if (selectedDegree === 'foundation year') {
      return courseDegree.includes('foundation') ||
        courseDegree.includes('preparatory year') ||
        courseDegree.includes('pre-degree');
    }

    // Handle Certificate levels
    if (selectedDegree.includes('certificate')) {
      // Handle Graduate Certificate separately
      if (selectedDegree === 'graduate certificate') {
        return courseDegree.includes('graduate certificate') ||
          courseDegree.includes('grad cert') ||
          (courseDegree.includes('graduate') && courseDegree.includes('certificate'));
      }

      // Handle Postgraduate Certificate separately
      if (selectedDegree === 'postgraduate certificate') {
        return courseDegree.includes('postgraduate certificate') ||
          courseDegree.includes('post graduate certificate') ||
          courseDegree.includes('pgcert') ||
          (courseDegree.includes('postgraduate') && courseDegree.includes('certificate'));
      }

      // Handle Certificate I-IV
      const certLevel = selectedDegree.match(/certificate\s+(i+|[1-4])/i);
      if (certLevel) {
        const level = certLevel[1];
        // Convert Roman numerals if needed
        const numericLevel = level.toLowerCase() === 'i' ? '1' :
          level.toLowerCase() === 'ii' ? '2' :
            level.toLowerCase() === 'iii' ? '3' :
              level.toLowerCase() === 'iv' ? '4' : level;
        return courseDegree.includes('certificate') &&
          (courseDegree.includes(level.toLowerCase()) || courseDegree.includes(numericLevel));
      }
    }

    // Handle Diploma and its variations
    if (selectedDegree === 'diploma') {
      return courseDegree.includes('diploma') &&
        !courseDegree.includes('advanced') &&
        !courseDegree.includes('leading to') &&
        !courseDegree.includes('graduate') &&
        !courseDegree.includes('postgraduate');
    }

    if (selectedDegree === 'graduate diploma') {
      return courseDegree.includes('graduate diploma') ||
        courseDegree.includes('grad dip') ||
        (courseDegree.includes('graduate') && courseDegree.includes('diploma'));
    }

    if (selectedDegree === 'postgraduate diploma') {
      return courseDegree.includes('postgraduate diploma') ||
        courseDegree.includes('post graduate diploma') ||
        courseDegree.includes('pgdip') ||
        (courseDegree.includes('postgraduate') && courseDegree.includes('diploma'));
    }

    if (selectedDegree === 'diploma leading to bachelor') {
      return courseDegree.includes('diploma') &&
        (courseDegree.includes('leading to bachelor') ||
          courseDegree.includes('pathway to bachelor') ||
          courseDegree.includes('articulation to bachelor'));
    }

    if (selectedDegree.includes('advanced diploma')) {
      return courseDegree.includes('advanced diploma') || courseDegree.includes('associate degree');
    }

    // Handle Bachelor's Degree
    if (selectedDegree === "bachelor's degree") {
      return courseDegree.includes('bachelor') &&
        !courseDegree.includes('honours') &&
        !courseDegree.includes('hons');
    }

    // Handle Bachelor Honours
    if (selectedDegree === 'bachelor honours') {
      return courseDegree.includes('bachelor') &&
        (courseDegree.includes('honours') || courseDegree.includes('hons'));
    }

    // Handle Master's Degrees
    if (selectedDegree === "master's degree (course work)") {
      return courseDegree.includes('master') &&
        (courseDegree.includes('course work') ||
          courseDegree.includes('coursework') ||
          !courseDegree.includes('research'));
    }

    if (selectedDegree === "master's degree (by research)") {
      return courseDegree.includes('master') &&
        (courseDegree.includes('research') ||
          courseDegree.includes('by research') ||
          courseDegree.includes('mphil') ||
          courseDegree.includes('master of philosophy'));
    }

    // Handle Doctoral Degree
    if (selectedDegree.includes('doctoral') || selectedDegree.includes('phd')) {
      return courseDegree.includes('phd') ||
        courseDegree.includes('doctoral') ||
        courseDegree.includes('doctorate') ||
        courseDegree.includes('doctor of philosophy');
    }

    return false;
  }

  // Function to populate course dropdown based on university selection and degree
  function populateCourseDropdown(universityName) {
    const courseSelect = document.getElementById('course');
    courseSelect.innerHTML = '<option value="">Select Course</option>';

    if (!universityName) return;

    const selectedDegree = document.getElementById('degree').value;

    // Filter courses for selected university and degree (if not "All")
    const courses = universityData
      .filter(item => {
        const matchesUniversity = item.University_Name === universityName;
        const matchesDegree = selectedDegree.toLowerCase() === 'all' ? true : degreesMatch(item.Degree, selectedDegree);
        return matchesUniversity && matchesDegree;
      })
      .map(item => item.Course)
      .filter(course => course); // Remove empty/null values

    // Add unique courses to dropdown
    [...new Set(courses)].sort().forEach(course => {
      const option = document.createElement('option');
      option.value = course;
      option.textContent = course;
      courseSelect.appendChild(option);
    });

    console.log(`Found ${courses.length} courses for ${universityName} with degree ${selectedDegree}`);
  }

  // Add degree change event listener to update universities and courses when degree changes
  document.getElementById('degree').addEventListener('change', async function (e) {
    console.log('Degree changed:', e.target.value);
    await populateUniversityDropdown(currentCountry);
    document.getElementById('course').innerHTML = '<option value="">Select Course</option>';
    updateStateDropdown(currentCountry);
  });

  // Add university change event listener
  document.getElementById('university').addEventListener('change', function (e) {
    console.log('University changed:', e.target.value);
    populateCourseDropdown(e.target.value);
    updateStateDropdown(currentCountry);
  });

  // Add course change event listener
  document.getElementById('course').addEventListener('change', function (e) {
    console.log('Course changed:', e.target.value);
    updateStateDropdown(currentCountry);
  });

  // Add state change event listener
  document.getElementById('state').addEventListener('change', function (e) {
    console.log('State changed:', e.target.value);
    setupLocationDropdown(currentCountry);
  });

  // Function to get states for cities
  function getStatesForCities(cities, country) {
    const states = new Set();
    Object.entries(countryConfigs[country].states).forEach(([state, stateCities]) => {
      if (cities.some(city => stateCities.includes(city))) {
        states.add(state);
      }
    });
    return Array.from(states).sort((a, b) => a.localeCompare(b));
  }

  function getStatesForLocation(location, country) {
    const states = new Set();
    const locationTrimmed = location.trim();

    Object.entries(countryConfigs[country].states).forEach(([state, cities]) => {
      if (cities.includes(locationTrimmed)) {
        states.add(state);
      }
    });

    return Array.from(states);
  }

  // Function to update state dropdown
  function updateStateDropdown(country) {
    const stateSelect = document.getElementById('state');
    const selectedUniversity = document.getElementById('university').value;
    const selectedCourse = document.getElementById('course').value;
    const selectedDegree = document.getElementById('degree').value;

    // Clear dropdown
    stateSelect.innerHTML = '<option value="">Select State</option>';

    // Get filtered universities
    const filteredUniversities = window.universityData.filter(uni => {
      if (selectedUniversity && uni.University_Name !== selectedUniversity) return false;
      if (selectedCourse && uni.Course !== selectedCourse) return false;
      if (selectedDegree && selectedDegree !== 'All' && !degreesMatch(uni.Degree, selectedDegree)) return false;
      return true;
    });

    // Get all states for filtered universities
    const availableStates = new Set();

    filteredUniversities.forEach(uni => {
      if (!uni.Location) return;

      // Split location and process each part
      const locations = uni.Location.split(',');
      locations.forEach(loc => {
        const statesForLocation = getStatesForLocation(loc, country);
        statesForLocation.forEach(state => availableStates.add(state));
      });
    });

    // Sort states alphabetically
    const sortedStates = Array.from(availableStates).sort((a, b) => a.localeCompare(b));

    // Add states to dropdown
    sortedStates.forEach(state => {
      const option = document.createElement('option');
      option.value = state;
      option.textContent = state;
      stateSelect.appendChild(option);
    });

    // Debug logging
    console.log('State Update:', {
      universities: filteredUniversities.length,
      states: sortedStates,
      filters: {
        university: selectedUniversity,
        course: selectedCourse,
        degree: selectedDegree
      }
    });
  }
});

// Download functionality
let downloadMenuVisible = false;

document.getElementById('downloadBtn').addEventListener('click', function (e) {
  e.stopPropagation();
  downloadMenuVisible = !downloadMenuVisible;
  const options = document.querySelector('.download-options');

  if (downloadMenuVisible) {
    options.classList.add('show');

    // Close when clicking outside
    const clickHandler = function (event) {
      if (!options.contains(event.target) && event.target !== this) {
        options.classList.remove('show');
        downloadMenuVisible = false;
        document.removeEventListener('click', clickHandler);
      }
    };

    document.addEventListener('click', clickHandler);
  } else {
    options.classList.remove('show');
  }
});

// Smooth hover implementation
document.querySelectorAll('.download-option').forEach(option => {
  option.addEventListener('mouseenter', function () {
    this.style.backgroundColor = '#f5f5f5';
  });

  option.addEventListener('mouseleave', function () {
    this.style.backgroundColor = 'white';
  });

  option.addEventListener('click', function (e) {
    e.stopPropagation();
    const type = this.getAttribute('data-type');
    const filteredData = getCurrentFilteredData();

    if (!filteredData || filteredData.length === 0) {
      alert('No data available to download');
      return;
    }

    if (type === 'pdf') {
      // Show client details modal before downloading
      showClientDetailsModal(filteredData);
    } else {
      downloadAsCSV(filteredData);
    }

    document.querySelector('.download-options').classList.remove('show');
    downloadMenuVisible = false;
  });
});

// Email functionality
document.getElementById('emailBtn').addEventListener('click', function () {
  const filteredData = getCurrentFilteredData();
  if (!filteredData || filteredData.length === 0) {
    alert('No data available to email');
    return;
  }
  showEmailModal(filteredData);
});

// Email Modal
function showEmailModal(data) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
        <div class="modal-content">
            <h3>Email University Results</h3>
            <div class="form-group">
                <label for="senderEmail">Your Email:</label>
                <input type="email" id="senderEmail" placeholder="your@email.com" required>
            </div>
            <div class="form-group">
                <label for="clientEmail">Recipient Email:</label>
                <input type="email" id="clientEmail" placeholder="client@example.com" required>
            </div>
            <div class="form-group">
                <label for="emailSubject">Subject:</label>
                <input type="text" id="emailSubject" value="Your University Search Results" required>
            </div>
            <div class="form-group">
                <label for="emailMessage">Message:</label>
                <textarea id="emailMessage" rows="4" required>Dear Client,

Please find attached the university search results you requested.

Best regards,
University Finder Team</textarea>
            </div>
            <div class="attachment-section">
                <h4>Attachments</h4>
                <div class="attachment-list" id="attachmentList"></div>
                <input type="file" id="attachmentInput" class="attachment-input" multiple>
                <button type="button" class="add-attachment-btn" onclick="document.getElementById('attachmentInput').click()">
                    <i class="fas fa-paperclip"></i> Add Attachment
                </button>
            </div>
            <div class="form-group">
                <label for="emailClient">Choose Email Client:</label>
                <select id="emailClient" required>
                    <option value="gmail">Gmail</option>
                    <option value="outlook">Microsoft Outlook</option>
                    <option value="default">Default Email Client</option>
                </select>
            </div>
            <div id="gmailAuthSection" style="margin: 15px 0; display: none;">
                <button id="gmailSignInBtn" class="modal-btn" style="background-color: #DB4437; color: white;">
                    <i class="fab fa-google"></i> Sign in with Gmail
                </button>
                <p id="gmailAuthStatus" style="margin-top: 10px; font-size: 14px; color: #666;"></p>
            </div>
            <div class="modal-actions">
                <button id="sendEmail" class="modal-btn primary">
                    <i class="fas fa-paper-plane"></i> Send Email
                </button>
                <button id="cancelEmail" class="modal-btn secondary">
                    Cancel
                </button>
            </div>
        </div>
    `;

  document.body.appendChild(modal);

  // Handle email client selection
  const emailClientSelect = document.getElementById('emailClient');
  const gmailAuthSection = document.getElementById('gmailAuthSection');
  const gmailSignInBtn = document.getElementById('gmailSignInBtn');
  const gmailAuthStatus = document.getElementById('gmailAuthStatus');

  emailClientSelect.addEventListener('change', function () {
    gmailAuthSection.style.display = this.value === 'gmail' ? 'block' : 'none';
  });

  // Initialize Gmail API when selecting Gmail
  if (emailClientSelect.value === 'gmail') {
    gmailAuthSection.style.display = 'block';
  }

  // Handle Gmail sign-in
  gmailSignInBtn.addEventListener('click', async () => {
    try {
      await loadGmailApi();
      const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
      if (isSignedIn) {
        const user = gapi.auth2.getAuthInstance().currentUser.get();
        const profile = user.getBasicProfile();
        gmailAuthStatus.textContent = `Signed in as ${profile.getEmail()}`;
        gmailAuthStatus.style.color = '#28a745';
        document.getElementById('senderEmail').value = profile.getEmail();
      }
    } catch (error) {
      console.error('Gmail sign-in error:', error);
      gmailAuthStatus.textContent = 'Failed to sign in. Please try again.';
      gmailAuthStatus.style.color = '#dc3545';
    }
  });

  // Handle file attachments
  const attachmentInput = document.getElementById('attachmentInput');
  const attachmentList = document.getElementById('attachmentList');
  const attachments = new Set();

  attachmentInput.addEventListener('change', function (e) {
    const files = e.target.files;
    for (let file of files) {
      if (!attachments.has(file.name)) {
        attachments.add(file.name);
        const attachmentItem = document.createElement('div');
        attachmentItem.className = 'attachment-item';
        attachmentItem.innerHTML = `
          <i class="fas fa-file"></i>
          ${file.name}
          <span class="remove-attachment" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
          </span>
        `;
        attachmentList.appendChild(attachmentItem);
      }
    }
    attachmentInput.value = ''; // Reset input
  });

  // Handle send email
  document.getElementById('sendEmail').addEventListener('click', async function () {
    const senderEmail = document.getElementById('senderEmail').value.trim();
    const clientEmail = document.getElementById('clientEmail').value.trim();
    const subject = document.getElementById('emailSubject').value.trim();
    const message = document.getElementById('emailMessage').value.trim();
    const emailClient = document.getElementById('emailClient').value;

    if (!validateEmail(senderEmail)) {
      alert('Please enter a valid sender email address');
      return;
    }

    if (!validateEmail(clientEmail)) {
      alert('Please enter a valid recipient email address');
      return;
    }

    const emailData = {
      to: clientEmail,
      from: senderEmail,
      subject: subject,
      body: message,
      attachments: Array.from(attachmentList.children).map(item => item.textContent.trim())
    };

    // Open email client based on selection
    openEmailClient(emailClient, emailData);
    modal.remove();
  });

  document.getElementById('cancelEmail').addEventListener('click', function () {
    modal.remove();
  });
}

function formatEmailContent(data, message) {
  let content = message + '\n\n';
  content += 'University Search Results:\n\n';

  // Add table headers
  content += 'University | Degree | Location | Score | Fee | Program Name\n';
  content += '----------|---------|----------|--------|-----|-------------\n';

  // Add table data
  data.forEach(row => {
    content += `${row.University_Name} | ${row.Degree} | ${row.Location} | `;
    content += `${row.Percentage_CGPA} | ${row.Fee} | ${row.Program_Name || 'N/A'}\n`;
  });

  return content;
}

function showAttachmentInstructions(callback) {
  const instructionModal = document.createElement('div');
  instructionModal.className = 'modal-overlay';
  instructionModal.innerHTML = `
    <div class="modal-content attachment-instructions">
      <h3>Attachment Instructions</h3>
      <div class="instruction-content">
        <p>Due to browser security restrictions, files need to be attached manually in your email client.</p>
        <ol>
          <li>Click "Continue" to open your email client</li>
          <li>When your email client opens, locate the attachment button</li>
          <li>Select the files you previously chose to attach</li>
        </ol>
        <div class="files-to-attach">
          <h4>Files to Attach:</h4>
          <ul>
            ${Array.from(document.getElementById('attachmentList').children)
      .map(item => `<li><i class="fas fa-file"></i> ${item.textContent.trim()}</li>`)
      .join('')}
          </ul>
        </div>
      </div>
      <div class="modal-actions">
        <button class="modal-btn primary" id="continueWithEmail">
          <i class="fas fa-check"></i> Continue
        </button>
        <button class="modal-btn secondary" id="cancelInstructions">
          Cancel
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(instructionModal);

  document.getElementById('continueWithEmail').addEventListener('click', function () {
    instructionModal.remove();
    if (callback) callback();
  });

  document.getElementById('cancelInstructions').addEventListener('click', function () {
    instructionModal.remove();
  });
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Update getCurrentFilteredData function to get actual URLs
function getCurrentFilteredData() {
  const rows = document.querySelectorAll('#resultsTable tbody tr:not([style*="display: none"])');
  if (rows.length === 0) return null;

  return Array.from(rows).map(row => {
    const cells = Array.from(row.querySelectorAll('td'));
    return {
      University_Name: cells[0].textContent.trim(),
      Location: cells[1].textContent.trim(),
      Degree: cells[2].textContent.trim(),
      Course: cells[3].textContent.trim(),
      Intake: cells[4].textContent.trim(),
      Percentage_CGPA: cells[5].textContent.trim(),
      English_Test: cells[6].textContent.trim(),
      Field_of_Study: cells[7].textContent.trim(),
      Fee: cells[8].textContent.trim(),
      Initial_Deposit: cells[9].textContent.trim(),
      Other_Remarks: cells[10].textContent.trim(),
      Course_link: cells[11].querySelector('a') ? cells[11].querySelector('a').href : 'N/A'
    };
  });
}

// Function for download as CSV
function downloadAsCSV(data) {
  const headers = Object.keys(data[0]);
  const csvRows = [];

  csvRows.push(headers.join(','));

  for (const row of data) {
    const values = headers.map(header => {
      const escaped = ('' + row[header]).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `university_results_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// Function to handle course links differently for PDF
function formatCourseLinkForPDF(link) {
  return link && link !== 'N/A' ? link : 'N/A';
}

// Update downloadAsPDF function to handle errors better
function downloadAsPDF(data, clientDetails) {
  try {
    console.log('Starting PDF generation...');

    if (!window.jspdf || !window.jsPDF) {
      console.error('jsPDF not found:', { jspdf: window.jspdf, jsPDF: window.jsPDF });
      throw new Error('PDF generation library not loaded properly');
    }

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No data available to generate PDF');
    }

    // Initialize jsPDF
    const doc = new window.jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a3'
    });

    // Set margins
    const margins = {
      top: 20,
      bottom: 20,
      left: 10,
      right: 10
    };

    // Add title
    doc.setFontSize(18);
    doc.setTextColor(44, 62, 80);
    doc.text('APTITUDE MIGRATION - Options as per client Profile', margins.left + 20, margins.top);

    // Add client details
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    const clientDetailsY = margins.top + 15;
    doc.text(`Client Name: ${clientDetails['Client Name']}`, margins.left, clientDetailsY);
    doc.text(`City: ${clientDetails['City']}`, margins.left + 100, clientDetailsY);
    doc.text(`Generated on: ${clientDetails['Date']}`, doc.internal.pageSize.getWidth() - margins.right - 50, clientDetailsY);

    // Define table headers
    const headers = [
      { title: "University", dataKey: "University_Name" },
      { title: "Location", dataKey: "Location" },
      { title: "Degree", dataKey: "Degree" },
      { title: "Course", dataKey: "Course" },
      { title: "Intake", dataKey: "Intake" },
      { title: "Score", dataKey: "Percentage_CGPA" },
      { title: "English Test", dataKey: "English_Test" },
      { title: "Field", dataKey: "Field_of_Study" },
      { title: "Fee", dataKey: "Fee" },
      { title: "Initial Deposit", dataKey: "Initial_Deposit" },
      { title: "Remarks", dataKey: "Other_Remarks" },
      { title: "Course Link", dataKey: "Course_link" }
    ];

    // Store link positions
    const linkPositions = [];

    // Process data for table
    const tableData = data.map(row => {
      return {
        University_Name: row.University_Name || 'N/A',
        Location: row.Location || 'N/A',
        Degree: row.Degree || 'N/A',
        Course: row.Course || 'N/A',
        Intake: row.Intake || 'N/A',
        Percentage_CGPA: row.Percentage_CGPA || 'N/A',
        English_Test: row.English_Test || 'N/A',
        Field_of_Study: row.Field_of_Study || 'N/A',
        Fee: formatCurrencyForPDF(row.Fee),
        Initial_Deposit: formatCurrencyForPDF(row.Initial_Deposit),
        Other_Remarks: row.Other_Remarks || 'N/A',
        Course_link: row.Course_link || 'N/A'
      };
    });

    // Configure autoTable
    doc.autoTable({
      head: [headers.map(h => h.title)],
      body: tableData.map(row => Object.values(row)),
      startY: clientDetailsY + 20,
      margin: margins,
      styles: {
        font: 'helvetica',
        fontSize: 8,
        cellPadding: 3,
        overflow: 'linebreak',
        halign: 'center', // Center align all cells by default
        valign: 'middle',
        lineWidth: 0.1,
        lineColor: [80, 80, 80],
        minCellHeight: 12
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center',
        cellPadding: 4
      },
      columnStyles: {
        0: { cellWidth: 45, halign: 'center' }, // University
        1: { cellWidth: 35, halign: 'center' }, // Location
        2: { cellWidth: 30, halign: 'center' }, // Degree
        3: { cellWidth: 45, halign: 'center' }, // Course
        4: { cellWidth: 20, halign: 'center' }, // Intake
        5: { cellWidth: 20, halign: 'center' }, // Score
        6: { cellWidth: 25, halign: 'center' }, // English Test
        7: { cellWidth: 30, halign: 'center' }, // Field
        8: { cellWidth: 25, halign: 'center' }, // Fee
        9: { cellWidth: 25, halign: 'center' }, // Initial Deposit
        10: { // Remarks column
          cellWidth: 40,
          fontStyle: 'normal',
          fontSize: 8,
          cellPadding: 5,
          overflow: 'linebreak',
          whiteSpace: 'pre-wrap',
          halign: 'center'
        },
        11: { // Course Link column
          cellWidth: 45,
          textColor: [0, 0, 255],
          fontStyle: 'normal',
          halign: 'center'
        }
      },
      didParseCell: function (data) {
        // Handle course links
        if (data.column.index === 11) {
          const cellValue = data.cell.raw;
          if (cellValue && cellValue !== 'N/A') {
            linkPositions.push({
              url: cellValue,
              x: data.cell.x,
              y: data.cell.y,
              w: data.cell.width,
              h: data.cell.height,
              pageNumber: data.pageNumber
            });
          }
        }

        // Handle remarks
        if (data.column.index === 10) {
          const cellValue = data.cell.raw;
          if (cellValue && cellValue !== 'N/A') {
            data.cell.styles.cellPadding = 5;
            data.cell.styles.whiteSpace = 'pre-wrap';
            data.cell.styles.overflow = 'linebreak';
            data.cell.styles.halign = 'left';
            data.cell.text = cellValue.split('\n');
          }
        }
      },
      didDrawCell: function (data) {
        // Add underline for course links
        if (data.column.index === 11 && data.cell.raw && data.cell.raw !== 'N/A') {
          doc.setDrawColor(0, 0, 255);
          doc.line(
            data.cell.x,
            data.cell.y + data.cell.height - 1,
            data.cell.x + data.cell.width,
            data.cell.y + data.cell.height - 1
          );
        }
      },
      didDrawPage: function (data) {
        // Add page numbers
        const pageNumber = `Page ${data.pageNumber} of ${data.pageCount}`;
        doc.setFontSize(8);
        doc.text(pageNumber, doc.internal.pageSize.getWidth() - margins.right - 30, doc.internal.pageSize.getHeight() - 10);

        // Add clickable links
        linkPositions.forEach(link => {
          if (link.pageNumber === data.pageNumber) {
            doc.link(link.x, link.y, link.w, link.h, { url: link.url });
          }
        });
      }
    });

    // Save PDF
    const timestamp = new Date().toLocaleDateString().replace(/\//g, '-');
    doc.save(`university_results_${timestamp}.pdf`);
    console.log('PDF generated successfully!');

  } catch (error) {
    console.error('Error generating PDF:', error);
    alert(`Error generating PDF: ${error.message}. Please check console for details.`);
  }
}

// Helper function to truncate long text
function truncateText(text, maxLength) {
  if (!text) return 'N/A';
  return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
}

// Helper function for currency formatting in PDF
function formatCurrencyForPDF(value, country = currentCountry) {
  if (!value) return 'N/A';
  const symbol = countryConfigs[country].currencySymbol;
  const num = parseFloat(value.replace(/[^\d.]/g, ''));
  return isNaN(num) ? value : symbol + num.toLocaleString('en-GB');
}

// Close dropdown when clicking outside
document.addEventListener('click', function () {
  document.querySelector('.download-options').classList.remove('show');
});

// Helper function to get active filters
function getActiveFilters() {
  return {
    degree: document.getElementById('degree').value !== 'Degree' ? document.getElementById('degree').value : null,
    englishTests: Array.from(document.querySelectorAll('input[name="englishTest"]:checked')).map(el => el.value),
    locations: Array.from(document.querySelectorAll('input[name="location"]:checked')).map(el => el.value),
    cgpa: document.getElementById('cgpa').value,
    fields: Array.from(document.querySelectorAll('input[name="field"]:checked')).map(el => el.value),
    fee: document.getElementById('fee').value
  };
}

// Add function to show client details modal
function showClientDetailsModal(data) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 400px;">
      <h3>Client Details</h3>
      <div class="form-group">
        <label for="clientName">Client Name:</label>
        <input type="text" id="clientName" placeholder="Enter client name" required>
      </div>
      <div class="form-group">
        <label for="clientCity">City:</label>
        <input type="text" id="clientCity" placeholder="Enter city" required>
      </div>
      <div class="modal-actions">
        <button id="proceedDownload" class="modal-btn primary">
          <i class="fas fa-download"></i> Download PDF
        </button>
        <button id="cancelDownload" class="modal-btn secondary">
          Cancel
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Handle download button click
  const proceedDownloadBtn = document.getElementById('proceedDownload');
  if (proceedDownloadBtn) {
    proceedDownloadBtn.addEventListener('click', function () {
      const clientName = document.getElementById('clientName').value.trim();
      const clientCity = document.getElementById('clientCity').value.trim();

      if (!clientName || !clientCity) {
        alert('Please enter both client name and city');
        return;
      }

      const clientDetails = {
        'Client Name': clientName,
        'City': clientCity,
        'Date': new Date().toLocaleDateString()
      };

      downloadAsPDF(data, clientDetails);
      modal.remove();
    });
  }

  // Handle cancel button click
  const cancelDownloadBtn = document.getElementById('cancelDownload');
  if (cancelDownloadBtn) {
    cancelDownloadBtn.addEventListener('click', function () {
      modal.remove();
    });
  }

  // Close modal when clicking outside
  modal.addEventListener('click', function (e) {
    if (e.target === modal) {
      modal.remove();
    }
  });
}
