package auth

import (
	"fmt"
	"log"
	"os"

	"github.com/go-ldap/ldap/v3"
)

func LDAPAuthenticate(username, password string) error {
	ldapServer := os.Getenv("LDAP_SERVER")
	baseDN := os.Getenv("LDAP_BASEDN")
	adBindUser := os.Getenv("LDAP_BIND_USER")
	adBindPassword := os.Getenv("LDAP_BIND_PASSWORD")

	conn, err := ldap.DialURL("ldap://" + ldapServer)
	if err != nil {
		log.Printf("LDAP DialURL error: %v", err)
		return err
	}
	defer conn.Close()

	var searchFilter string

	// check if using AD
	if adBindUser != "" {
		// Windows Active Directory
		if err := conn.Bind(adBindUser, adBindPassword); err != nil {
			log.Printf("LDAP Bind error with service account: %v", err)
			return err
		}
		searchFilter = fmt.Sprintf("(sAMAccountName=%s)", ldap.EscapeFilter(username))
	} else {
		// OpenLDAP
		searchFilter = fmt.Sprintf("(uid=%s)", ldap.EscapeFilter(username))
	}

	searchRequest := ldap.NewSearchRequest(
		baseDN,
		ldap.ScopeWholeSubtree, ldap.DerefAlways, 0, 0, false,
		searchFilter,
		[]string{"dn"},
		nil,
	)

	sr, err := conn.Search(searchRequest)
	if err != nil || len(sr.Entries) != 1 {
		log.Printf("LDAP Search error: %v", err)
		return fmt.Errorf("user not found")
	}

	userDN := sr.Entries[0].DN

	if err := conn.Bind(userDN, password); err != nil {
		log.Printf("LDAP Bind error for %s: %v", userDN, err)
		return fmt.Errorf("invalid credentials")
	}

	return nil
}
