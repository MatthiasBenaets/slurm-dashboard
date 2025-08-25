package handlers

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strings"
)

func SlurmHandler(w http.ResponseWriter, r *http.Request) {
	var prefix, path string

	// determine which API to proxy
	switch {
	case strings.HasPrefix(r.URL.Path, "/api/slurm/"):
		prefix = "/api/slurm"
		path = "/slurm/"
	case strings.HasPrefix(r.URL.Path, "/api/slurmdb/"):
		prefix = "/api/slurmdb"
		path = "/slurmdb/"
	default:
		http.Error(w, "Invalid API path", http.StatusNotFound)
		return
	}

	// parse internal API URL
	remote, err := url.Parse(os.Getenv("SLURM_API_SERVER") + path + os.Getenv("SLURM_API_VERSION"))
	if err != nil {
		log.Printf("Error parsing internal API URL: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	// create reverse proxy
	proxy := httputil.NewSingleHostReverseProxy(remote)
	proxy.Director = func(req *http.Request) {
		req.URL.Scheme = remote.Scheme
		req.URL.Host = remote.Host
		req.URL.Path = remote.Path + strings.TrimPrefix(req.URL.Path, prefix)
		req.Header.Add("X-SLURM-USER-TOKEN", os.Getenv("SLURM_USER_TOKEN"))
	}

	// proxy request
	proxy.ServeHTTP(w, r)
}
