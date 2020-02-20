
var iv="FF245C99227E6B2EFE7510B35DD3D137";
var SALT = "3FF2EC0C9C6B7B945225DEBAD71A01B6965FE84C95A70EB132A82F88C0A59A55";
var PASSPHRASE = "AB33T33##aasd*93339+_2";

var AesUtil = function(keySize, iterationCount) {
  this.keySize = keySize / 32;
  this.iterationCount = iterationCount;
};

AesUtil.prototype.generateKey = function(salt, passPhrase) {
  var key = CryptoJS.PBKDF2(
      passPhrase, 
      CryptoJS.enc.Hex.parse(salt),
      { keySize: this.keySize, iterations: this.iterationCount });
  return key;
}

AesUtil.prototype.encrypt = function(salt, iv, passPhrase, plainText) {
  var key = this.generateKey(salt, passPhrase);
  var encrypted = CryptoJS.AES.encrypt(
      plainText,
      key,
      { iv: CryptoJS.enc.Hex.parse(iv) });
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

AesUtil.prototype.decrypt = function(salt, iv, passPhrase, cipherText) {
	  var key = this.generateKey(salt, passPhrase);
	  var cipherParams = CryptoJS.lib.CipherParams.create({
	    ciphertext: CryptoJS.enc.Base64.parse(cipherText)
	  });
	  var decrypted = CryptoJS.AES.decrypt(
	      cipherParams,
	      key,
	      { iv: CryptoJS.enc.Hex.parse(iv) });
	  return decrypted.toString(CryptoJS.enc.Utf8);
}

function aesEncode(input){
	
	var aes=new AesUtil(128,800);
	var content=aes.encrypt(SALT,iv,PASSPHRASE,input);
	return content;
	
}

function aesDecode(input){
	
	var aes=new AesUtil(128,800);
	var content=aes.decrypt(SALT,iv,PASSPHRASE,input);
	return content;
	
}
